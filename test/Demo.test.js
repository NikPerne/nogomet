const { assert } = require("console");

/**
 * Functional tests
 */
(async function Demo() {
  /**
   * Libraries
   */
  const { execSync } = require("child_process");
  const { describe, it, after, before } = require("mocha");
  const { Builder, By } = require("selenium-webdriver");
  const chrome = require("selenium-webdriver/chrome");
  const expect = require("chai").expect;
  const https = require("https");
  /**
   * Parameters
   */
  let applicationUrl = "https://host.docker.internal:3000/";
  let seleniumServerUrl = "http://localhost:4445/wd/hub";
  let browser, jwtToken;
  const axios = require("axios").create({
    baseURL: applicationUrl + "api/",
    timeout: 5000,
  });
  /**
   * Error handling
   */
  process.on("unhandledRejection", (error) => console.log(error));
  /**
   * Confirm the exception for the self-signed certificate
   */
  let confirmHttpsException = async (browser) => {
    let button = await browser.findElement(
      By.xpath("//button[contains(text(), 'Advanced')]")
    );
    expect(button).to.not.be.empty;
    await button.click();
    let link = await browser.findElement(
      By.xpath("//a[contains(text(), 'Proceed to')]")
    );
    expect(link).to.not.be.empty;
    await link.click();
  };
  try {
    before(async () => {
      browser = new Builder()
        .forBrowser("chrome")
        .setChromeOptions(
          new chrome.Options()
            .addArguments("start-maximized")
            .addArguments("disable-infobars")
            .addArguments("allow-insecure-localhost")
            .addArguments("allow-running-insecure-content")
        )
        .usingServer(seleniumServerUrl)
        .build();
      await browser.manage().setTimeouts({ implicit: 40 * 1000 });
    });
    describe("About application", () => {
      before(async () => {
        await browser.get(applicationUrl);
        await confirmHttpsException(browser);
      });
      before(async () => await browser.get(applicationUrl));
      it("select about application", async () => {
        let link = await browser.findElement(
          By.xpath("//a[contains(text(), 'Information')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
        link = await browser.findElement(
          By.xpath("//a[contains(text(), 'O aplikaciji')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
      });
      context("accuracy of data on the about application page", () => {
        it("page title", async () => {
          let title = await browser.findElement(By.css("h1"));
          expect(title).to.not.be.empty;
          expect(await title.getText()).to.be.equal("About");
        });
        it("page text", async () => {
          let text = await browser.findElement(
            By.xpath("//p[contains(text(), 'kjer se lahko enostavno prijavite')]")
          );
          expect(text).to.not.be.empty;
          expect(await text.getText()).to.have.string(
            "Dobrodošli v aplikaciji Nogomet, kjer se lahko enostavno prijavite in sledite statistikam vseh uporabnikov, ki so se prijavili na rekreativno igranje nogometa."
          );
        });
      });
    });
    describe("Register new user", () => {
      before(async () => await browser.get(applicationUrl));
      it("delete user from database", async () => {
        let dockerDeleteUser =
          'docker exec -i web-dev-mongo-db bash -c "mongosh Demo --eval \'db.Users.deleteOne({ email: \\"janez@kranjski.net\\" })\'"';
        let result = execSync(dockerDeleteUser).toString();
        expect(result).to.match(/acknowledged: true/);
      });
      it("user login", async () => {
        let link = await browser.findElement(
          By.xpath("//a[contains(text(), 'Guest')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
        link = await browser.findElement(
          By.xpath("//a[contains(text(), 'Login')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
      });
      it("select register", async () => {
        let link = await browser.findElement(
          By.xpath("//a[contains(text(), 'register')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
      });
      it("user data entry", async () => {
        let name = await browser.findElement(By.css("input[name='name']"));
        expect(name).to.not.be.empty;
        name.sendKeys("Janez Kranjski");
        let email = await browser.findElement(By.css("input[name='email']"));
        expect(email).to.not.be.empty;
        email.sendKeys("janez@kranjski.net");
        let password = await browser.findElement(
          By.css("input[name='password']")
        );
        expect(password).to.not.be.empty;
        password.sendKeys("test");
        let button = await browser.findElement(
          By.xpath("//button[contains(text(), 'Register')]")
        );
        await button.click();
      });
      it("check if user is logged in", async () => {
        let user = await browser.findElement(
          By.xpath("//a[contains(text(), 'Janez Kranjski')]")
        );
        expect(user).to.not.be.empty;
      });
      it("get JWT token", async () => {
        jwtToken = await browser.executeScript(() =>
          localStorage.getItem("demo-token")
        );
        expect(jwtToken).to.not.be.empty;
      });
    });
    describe("Event list", () => {
      before(async () => await browser.get(applicationUrl+"/events"));
      it("number of events on the home page", async () => {
        let events = await browser.findElements(By.css(".card-body"));
        expect(events).to.be.an("array").to.have.lengthOf(10);
      });
    });
    describe("Event details", () => {
      before(() => browser.get(applicationUrl+"/events"));
      it("select 15. november, 2023", async () => {
        let link = await browser.findElement(
          By.xpath("//a[contains(text(), '15. november, 2023')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
      });
      context("accuray of data on the event details page", () => {
        it("event title", async () => {
          let title = await browser.findElement(By.css("h6"));
          expect(title).to.not.be.empty;
          expect(await title.getText()).to.be.equal(
            "Description"
          );
        });
      });
    });
    describe("Add signup", async () => {
      before(async () => await browser.get(applicationUrl+"/events"));
      it("select 15. november, 2023", async () => {
        let link = await browser.findElement(
          By.xpath("//a[contains(text(), '15. november, 2023')]")
        );
        expect(link).to.not.be.empty;
        await link.click();
      });
      it("check if 15. november, 2023 page is displayed", async () => {
        let title = await browser.findElement(
          By.xpath("//h6[contains(text(), 'Description')]")
        );
        expect(title).to.not.be.empty;
        expect(await title.getText()).to.be.equal(
          "Description"
        );
      });
      it("click the button to add a signup", async () => {
        await browser.executeScript(
          "window.scrollBy(0,document.body.scrollHeight)"
        );
        button = await browser.findElement(
          By.xpath("//button[contains(., 'Pridem')]")
        );
        await button.click();
      });
      it("check if the comment has been added", async () => {
        let lastComment = await browser.findElement(
          By.id("signup")
        );
        expect(lastComment).to.not.be.empty;
        let author = await lastComment.findElement(By.xpath("//div[contains(text(), 'Janez Kranjski')]"));
        expect(author).to.not.be.empty;
        expect(await author.getText()).to.be.equal("Janez Kranjski");
        let comment = await lastComment.findElement(By.xpath("//div[contains(text(), 'Pridem')]"));
        expect(comment).to.not.be.empty;
        expect(await comment.getText()).to.be.equal(
          "Pridem"
        );
      });
      it("delete user's signups", async function () {
        let link = await browser.getCurrentUrl();
        let eventId = link.split("events/")[1];
        expect(eventId).to.not.be.empty;
        let event = await axios({
          method: "get",
          url: "events/" + eventId,
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        });
        let signups = (await event.data.signedup)
          .filter((x) => {
            return x.name == "Janez Kranjski";
          })
          .map((x) => x._id);
        for (const signupId of signups) {
          let response = await axios({
            method: "delete",
            url: "events/" + eventId + "/signups/" + signupId,
            headers: { Authorization: "Bearer " + jwtToken },
            httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          });
          expect(response.status).to.be.equal(204);
        }
        await browser.get(applicationUrl);
      });
    });
    describe("User logout", async () => {
      before(() => browser.get(applicationUrl));
      it("check if the user is logged in", async () => {
        let user = await browser.findElement(
          By.xpath("//a[contains(text(), 'Janez Kranjski')]")
        );
        expect(user).to.not.be.empty;
      });
      it("request logout", async () => {
        let user = await browser.findElement(
          By.xpath("//a[contains(text(), 'Janez Kranjski')]")
        );
        expect(user).to.not.be.empty;
        await user.click();
        let logout = await browser.findElement(
          By.xpath("//a[contains(text(), 'Logout')]")
        );
        expect(logout).to.not.be.empty;
        await logout.click();
      });
      it("check if the user is logged out", async () => {
        let login = await browser.findElement(
          By.xpath("//a[contains(text(), 'Login')]")
        );
        expect(login).to.not.be.empty;
      });
    });
    after(async () => {
      browser.quit();
    });
  } catch (error) {
    console.log("An error occurred during the test!");
    console.log(error);
  }
})();
