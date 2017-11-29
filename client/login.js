import $ from 'jquery';
import Cookies from 'js-cookie';

export const setLoginHandlers = () => {
  $(".login-form").submit((e) => {
    e.preventDefault();
    const userName = $("#username-login").val();
    const password = $("#password-login").val();

    $.post('/api/auth/login', {userName, password}).then((user) => {
      Cookies.set('jwt', user.authToken);
      Cookies.set('loggedInUserId', user.userId);
      window.location = '/dashboard';
    });
  });
};