import { Page } from "playwright";

export class LoginManager {
    constructor(private page: Page) {}

    async login(email: string, password: string) {
        console.log("Logging into LinkedIn...");
        await this.page.goto("https://www.linkedin.com/login");

        await this.page.fill("#username", email);
        await this.page.fill("#password", password);
        await this.page.click("button[type=submit]");

        await this.page.waitForSelector("div.global-nav__content", { timeout: 30000 });
        console.log("Login successful!");
    }
}
