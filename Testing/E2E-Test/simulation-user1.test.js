const puppeteer = require("puppeteer");
let rootUrl = "have-a-challenge.netlify.app";
const pullRequestId = process.env.GITHUB_PR_NUMBER;

beforeAll(async () => {
  if (pullRequestId) {
    console.log("PR: " + pullRequestId);
    rootUrl = `deploy-preview-${pullRequestId}--have-a-challenge.netlify.app`;
  } else if (process.env.GITHUB_REF) {
    rootUrl = `have-a-challenge.netlify.app`;
  } else {
    console.log("not in pr");
  }
});

describe("User already have an account", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`https://${rootUrl}/webpages/html/home.html`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("navigate to login.html", async () => {
    let login_page = `https://${rootUrl}/webpages/html/login.html`;
    // console.log(page.url());
    expect(page.url()).toBe(login_page);
  });

  it("tries to log in", async () => {
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password", "123456");
    await page.click("button.login-btn");
    let home_page = `https://${rootUrl}/webpages/html/home.html`;

    const response = await page.waitForResponse((response) => {
      // Check if the request URL matches the expected URL
      return (
        response
          .url()
          .includes(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"
          ) && response.status() === 200
      );
    });
    await page.waitForNavigation();

    expect(page.url()).toBe(home_page);
  });

  it("has signout button", async () => {
    const log_out_text = await page.evaluate(() => {
      const e = document
        .querySelector("nav-bar")
        .shadowRoot.querySelector(".login-signup");
      return e.textContent;
    });
    console.log(log_out_text);
    expect(log_out_text).toBe("Sign Out");
  });

  it("click refreshes refresh challenge", async () => {
    await page.click("#refresh");

    const response = await page.waitForResponse((response) => {
      // Check if the request URL matches the expected URL
      return (
        response
          .url()
          .includes("https://cse210-group13-default-rtdb.firebaseio.com/") &&
        response.status() === 200
      );
    });

    const screenshotPath = "./screenshot.png";
    await page.screenshot({ path: screenshotPath });

    const cur_text = await page.evaluate(() => {
      return document.querySelector("#challenge_text").textContent;
    });
    console.log(cur_text);

    await page.click("#refresh");

    const response2 = await page.waitForResponse((response) => {
      // Check if the request URL matches the expected URL
      return (
        response
          .url()
          .includes("https://cse210-group13-default-rtdb.firebaseio.com/") &&
        response.status() === 200
      );
    });

    const next_text = await page.evaluate(() => {
      return document.querySelector("#challenge_text").textContent;
    });
    console.log(next_text);

    expect(cur_text).not.toEqual(next_text);
  });

  it("click finsih receives stars", async () => {
    const cur_stars = await page.evaluate(() => {
      return document
        .querySelector("nav-bar")
        .shadowRoot.querySelector("#stars").textContent;
    });

    console.log("current number of stars is ", cur_stars);

    await page.click("#finish");
    for (let i = 0; i < 3; i++) {
      // wait for all three reponses to come back
      await page.waitForResponse((response) => {
        return (
          response
            .url()
            .includes(
              "https://cse210-group13-default-rtdb.firebaseio.com/users/"
            ) &&
          response.url().includes("challenges.json") &&
          response.status() === 200
        );
      });
    }

    const next_stars = await page.evaluate(() => {
      return document
        .querySelector("nav-bar")
        .shadowRoot.querySelector("#stars").textContent;
    });
    console.log("after click finish, number of stars is", next_stars);

    const screenshotPath = "./screenshot.png";
    await page.screenshot({ path: screenshotPath });

    expect(next_stars - 1).toBe(parseInt(cur_stars));
  });
});
