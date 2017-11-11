
export default class UserComponents {
  constructor(data) {
    this.userId = data.id;
    this.userName = data.userName;
    this.fullName = data.fullName;
    this.avatar = data.avatar;
    this.trackerIds = data.trackerIds;
  }

  getProfileHtml() {
    const template = `
    <h2>Profile</h2>
    <article class="profile-container">
      <h4>Username</h4>
      <h4>Password</h4>
    </article>
    `;
    return template;
  }
}