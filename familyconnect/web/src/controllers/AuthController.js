// Luồng đăng ký, đăng nhập, duyệt thành viên
import { AuthService } from '../services/AuthService.js';
import { AppConfig } from '../constants/AppConfig.js';
import { StorageHelper } from '../utils/StorageHelper.js';

export class AuthController {
  constructor(service = new AuthService()) {
    this.service = service;
  }

  /** Gắn sự kiện cho trang index.html. */
  init() {
    if (StorageHelper.isLoggedIn()) {
      globalThis.location.replace(AppConfig.HOME_PAGE);
      return;
    }

    const loginForm = document.getElementById('p-login');
    const loginError = document.getElementById('login-error');
    const regForm = document.getElementById('p-reg');

    // Ô báo lỗi cho form đăng ký (index.html chưa có sẵn)
    const regMsg = document.createElement('div');
    regMsg.className = 'muted';
    regMsg.setAttribute('role', 'alert');
    regForm.querySelector('#btn-register').before(regMsg);

    document.getElementById('btn-login').addEventListener('click', () => this.#handleLogin(loginForm, loginError));
    // Nhấn Enter trong form đăng nhập cũng đăng nhập
    loginForm.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.#handleLogin(loginForm, loginError); }
    });
    document.getElementById('btn-register').addEventListener('click', () => this.#handleRegister(regForm, regMsg, loginError));
  }

  async #handleLogin(form, errorBox) {
    errorBox.textContent = '';
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    if (!email || !password) {
      errorBox.textContent = 'Vui lòng nhập email và mật khẩu.';
      return;
    }
    try {
      await this.service.login(email, password);
      globalThis.location.href = AppConfig.HOME_PAGE;
    } catch (err) {
      errorBox.textContent = err.message;
    }
  }

  async #handleRegister(form, msgBox, loginError) {
    msgBox.textContent = '';
    const full_name = form.elements.full_name.value.trim();
    const email = form.elements.email.value.trim();
    const password = form.elements.password.value;
    const password2 = document.getElementById('r-pass2').value;

    if (!full_name || !email || !password) {
      msgBox.textContent = 'Vui lòng nhập đủ họ tên, email và mật khẩu.';
      return;
    }
    if (password.length < 8) {
      msgBox.textContent = 'Mật khẩu phải từ 8 ký tự.';
      return;
    }
    if (password !== password2) {
      msgBox.textContent = 'Mật khẩu nhập lại không khớp.';
      return;
    }
    try {
      await this.service.register({ full_name, email, password });
      // Chuyển sang tab Đăng nhập
      document.getElementById('t-login').checked = true;
      document.getElementById('l-email').value = email;
      loginError.textContent = 'Đăng ký thành công, hãy đăng nhập.';
      form.reset();
    } catch (err) {
      msgBox.textContent = err.message;
    }
  }

  logout() {
    this.service.logout();
    globalThis.location.href = AppConfig.LOGIN_PAGE;
  }
}