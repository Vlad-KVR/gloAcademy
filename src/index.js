'use strict';

import "@babel/polyfill";
import 'nodelist-foreach-polyfill';
import elementClosest from 'element-closest';
import "formdata-polyfill";
import "es6-promise";
import "fetch-polyfill";

elementClosest(window);  

import countTimer from './modules/countTimer';
import toggleMenu from './modules/toggleMenu';
import togglePopUp from './modules/togglePopUp';
import tabs from './modules/tabs';
import slider from './modules/slider';
import changeImg from './modules/changeImg';
import calculator from './modules/calculator';
import validationForm from './modules/validationForm';
import sendForm from './modules/sendForm';

	//Таймер
	countTimer('14 may 2020');
	//Меню
	toggleMenu();

	//popUp
	togglePopUp();

	//Табы
	tabs();

	//слайдер
	slider();

	// смена картинок "Наша команда"
	changeImg();

	//калькулятор
	calculator(100);

	//validation-form
	validationForm();

	//send-ajax-form
	sendForm();