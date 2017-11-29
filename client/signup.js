import $ from "jquery";
import Cookies from 'js-cookie';
import {renderLoginForm} from './index.render-views';
  

export const setSignUpHandlers = () => {
  $(".signup-form").submit((e) => {
    e.preventDefault();
    const userName = $("#username").val();
    const password = $("#password").val();

    $.post('/api/auth/signup', {userName, password}).then((user) => {
      renderLoginForm();
    });
  });
};
