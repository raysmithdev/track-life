import $ from "jquery";

export const setSignUpHandlers = () => {
  $(".signup-form").submit((e) => {
    e.preventDefault();
    const userName = $("#username").val();
    const password = $("#password").val();

    $.post('/api/auth/signup', {userName, password}).then((user) => {
      // set jwt cookie
      // maybe set userId to cookie too???
      console.log(user);
    });
  });
};
