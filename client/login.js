import $ from 'jquery';
import Cookies from 'js-cookie';

export const setLoginHandlers = () => {
  $(".login-form").submit((e) => {
    e.preventDefault();
    const userName = $("#username-login").val();
    const password = $("#password-login").val();

    $.post('/api/auth/login', {userName, password}).then((user) => {
      // set jwt cookie
      // maybe set userId to cookie too???
      Cookies.set('jwt', user.authToken);
      Cookies.set('loggedInUserId', user.userId);
      console.log(user);
      window.location = '/dashboard';
      
    });
  });
};
