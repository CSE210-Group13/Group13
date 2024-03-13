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

describe("homepage navigates to login page", () => {
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
});

describe("login with wrong username and password", () => {
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

  it("should stay on the same page display error message", async () => {
    let login_page = `https://${rootUrl}/webpages/html/login.html`;
    console.log(page.url());
    await page.type("#username", "nonsense");
    await page.type("#password", "nonsense");
    await page.click("button.login-btn");

    const response = await page.waitForResponse((response) => {
      // Check if the request URL matches the expected URL
      return (
        response.url() ===
          "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC4iQLVT5OsrS1IufO5QZHNGyi5x1ECWj0" &&
        response.status() === 400
      );
    });

    // console.log(response);
    const error_element_handle = await page.$(".error-message");
    const inner_text = await page.evaluate(
      (element) => element.textContent,
      error_element_handle
    );

    // // Define the path and filename for the screenshot
    // const screenshotPath = "./screenshot.png";
    // // Take the screenshot
    // await page.screenshot({ path: screenshotPath });

    expect(inner_text).toBe("Login incorrect");
    expect(page.url()).toBe(login_page);
  });
});

describe("homepage navigates to login page and login correctly", () => {
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

  it("login corretly", async () => {
    let home_page = `https://${rootUrl}/webpages/html/home.html`;
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password", "123456");
    await page.click("button.login-btn");

    await page.waitForNavigation(); 
    console.log(page.url());

    expect(page.url()).toBe(home_page); 
  });
});
