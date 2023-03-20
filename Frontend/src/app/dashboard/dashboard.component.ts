import { Component, AfterViewInit, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from '../services/bill.service';
import { DashboardService } from '../services/dashboard.service';
import { SnackbarService } from '../services/snackbar.service';
import { GlobalConstants } from '../shared/global-constants';
import * as echarts from 'echarts';
import jwtDecode from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit, OnInit {
	

	reponseMessage:any;
	data:any;
	dayToWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	profitEachWeek: number[] = [0, 0, 0, 0, 0, 0, 0];
	value: number = 0;
	lastWeekDays: string[] = [];
	profitLastWeek: number[] = [0, 0, 0, 0, 0, 0, 0];
	sortedNameFrequency: any;

	ngAfterViewInit() { }

	getSevenDaysFromNow() {
		let today: Date = new Date();
		console.log(today.toISOString().substring(0, 10));
		for (let i = 6; i >= 0; i--) {
			let pastDate = new Date();
			let day = today.getDate() - i;
			pastDate.setDate(day);
			this.lastWeekDays.push(pastDate.toISOString().substring(0, 10));
		}
		console.log(this.lastWeekDays);
		
	}


	constructor(
		private dashboardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackbarService: SnackbarService,
		private billService: BillService,
		private router: Router) {
			this.ngxService.start();
			this.getSevenDaysFromNow();
			this.dashboardData();

			const token:any = localStorage.getItem('token');

			let tokenPayload: any;
			try {
				tokenPayload = jwtDecode(token);
			} catch (err) {
				localStorage.clear();
				this.router.navigate(['/']);
			}

			if (tokenPayload.role == 'admin') {
				this.getOrder();
				this.value = 2;
			}

	}
	ngOnInit(): void {
		// throw new Error('Method not implemented.');
		// this.initChart();
		
	}

	

	dashboardData() {
		this.dashboardService.getDetails().subscribe((response:any) => {
			this.ngxService.stop();
			this.data = response;
		}, (error:any) => {
			this.ngxService.stop();
			console.log(error);
			if (error.error?.message) {
				this.reponseMessage = error.error?.message;
			} else {
				this.reponseMessage = GlobalConstants.genericError;
			}
			this.snackbarService.openSnackBar(this.reponseMessage, GlobalConstants.error);
		})
	}


	getOrder() {
		// this.ngxService.start();
		this.billService.getBills().subscribe((response: any) => {
			//this.ngxService.stop();
			console.log(response);
			console.log(response[0].uuid, typeof response[0].uuid);
			let map = new Map<string, number>();
			for (let i = 0; i < response.length; i++) {
				// this.extractDate(response[i].uuid.slice(5));
				this.generateProfitForDaysInEachWeek(response[i]);
				this.generateProfitForLastWeek(response[i]);
				this.generateTop5LikeFood(response[i], map);

			}

			// console.log(this.profitLastWeek);
			console.log('map is', map);
			this.initPieChart(map);
			this.initLineChart();
			this.initBarChart(this.profitEachWeek);
			
		}, (error: any) => {
			console.log('error in get Order');
			this.snackbarService.openSnackBar('error in get order', GlobalConstants.error);
		});
	}

	

	generateTop5LikeFood(bill: any, map: Map<string, number>) {
		let obj = JSON.parse(bill.productDetail);
		// console.log('product detail is', obj);
		for (let i = 0; i < obj.length; i++) {
			if (map.has(obj[i]['name'])) {
				map.set(obj[i]['name'], map.get(obj[i]['name'])! + (Number)(obj[i]['quantity']));
			} else {
				map.set(obj[i]['name'], (Number)(obj[i]['quantity']));
			}
		} 
		
	}


	generateProfitForLastWeek(bill: any) {
		let mileSeconds: number = Number(bill.uuid.slice(5));
		// console.log(mileSeconds, typeof mileSeconds);
		let date: Date = new Date(mileSeconds);
		// console.log('date is', date);
		let dateString: string = date.toISOString().substring(0, 10);
		let pos: number = this.lastWeekDays.findIndex(function checkDateString(lastWeekDay) {
			return dateString === lastWeekDay;
		});
		if (pos >= 0) {
			this.profitLastWeek[pos] += bill.total;
		}
	}


	generateProfitForDaysInEachWeek(bill: any) {
		// console.log('bill is', bill);
		let dayInWeek: number = this.extractDate(bill.uuid.slice(5));
		// console.log('bill total is', bill.total);
		// console.log('weekday', dayInWeek);
		let profit = this.profitEachWeek[dayInWeek];
		profit += bill.total;
		this.profitEachWeek[dayInWeek] = profit;
		// console.log('value should be added', this.profitEachWeek[dayInWeek]);

	}


	extractDate(longTime: string): number {
		let number = Number(longTime);
		console.log(number, typeof number);
		let date = new Date();
		date.setTime(Number(longTime));
		console.log(date + '-----');
		console.log('get which day' + this.dayToWeek[date.getDay()-1]);
		return date.getDay() - 1;
	}


	initBarChart(profitEachWeek: number[]) {
		let chartDom = document.getElementById('testChart');

		

		if (chartDom) {
			chartDom.style.height = '500px';
			let myChart = echarts.init(chartDom);
			let option = {
				title: {
					text: 'Which WeekDay Earns more?',
					left: 'center'
				},
				xAxis: {
					type: 'category',
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: profitEachWeek,
					type: 'bar',
					showBackground: true,
					backgroundStyle: {
					color: 'rgba(180, 180, 180, 0.2)'
					}
				}]
			};
			option && myChart.setOption(option);
		}

   		
	}




	initLineChart() {
		let chartDom = document.getElementById('testChart2');

		if (chartDom) {
			chartDom.style.height = '500px';
			let myChart = echarts.init(chartDom);
			let option = {
				title: {
					text: 'Earning in last seven days',
					left: 'center'
				},
				xAxis: {
				  type: 'category',
				  data: this.lastWeekDays
				},
				yAxis: {
				  type: 'value'
				},
				series: [
				  {
					data: this.profitLastWeek,
					type: 'line',
					smooth: true
				  }
				]
			};
			option && myChart.setOption(option);

		}
	}


	initPieChart(map: Map<string, number>) {
		
		let arr: { name: string; value: number; }[] = [];

		let sortedMap = new Map([...map.entries()].sort((a, b) => (b[1] - a[1])));
		console.log('sorted map is', sortedMap);
		sortedMap.forEach((value, key) => {
			arr.push({
				name: key,
				value: value
			})
		});

		console.log('arr is', arr);

		
		
		let chartDom = document.getElementById('testChart3');

		if (chartDom) {
			chartDom.style.height = '600px';
			let myChart = echarts.init(chartDom);
			let option = {
				legend: {
				  top: 'bottom'
				},
				toolbox: {
				  show: true,
				  feature: {
					mark: { show: true },
					dataView: { show: true, readOnly: false },
					restore: { show: true },
					saveAsImage: { show: true }
				  }
				},
				tooltip: {
				  trigger: 'item',
				  formatter: '{a} <br/>{b} : {c} ({d}%)'
				},
				series: [
				  {
					name: 'Nightingale Chart',
					type: 'pie',
					radius: [50, 250],
					center: ['50%', '50%'],
					roseType: 'area',
					itemStyle: {
					  borderRadius: 8
					},
					data: arr
				  }
				]
			};
			  
			  
			option && myChart.setOption(option);
		}


	}




}
