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

  it("click to signup.html", async () => {
    let signup_page = `https://${rootUrl}/webpages/html/signup`;
    await page.click(".signup-option p a");
    console.log(page.url());

    expect(page.url()).toBe(signup_page);
  });
});

describe("homepage navigates to login page", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`https://${rootUrl}/webpages/html/signup.html`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("signup with password too short", async () => {
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password1", "1");
    await page.type("#password2", "1");
    await page.click("button.signup-btn");

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const text = await page.evaluate(() => {
      const e = document.querySelector("a.error-message");
      return e.textContent;
    });

    console.log(text);
    expect(text).toContain("at least 6 characters");
  });

  it("signup with password not match", async () => {
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password1", "123");
    await page.type("#password2", "1");
    await page.click("button.signup-btn");

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const text = await page.evaluate(() => {
      const e = document.querySelector("a.error-message");
      return e.textContent;
    });

    console.log(text);
    expect(text).toContain("Passwords must match");
  });

  it("signup with password not match 2", async () => {
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password1", "123");
    await page.type("#password2", "1234567");
    await page.click("button.signup-btn");

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const text = await page.evaluate(() => {
      const e = document.querySelector("a.error-message");
      return e.textContent;
    });

    console.log(text);
    expect(text).toContain("Passwords must match");
  });

  it("signup with password not match 3", async () => {
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password1", "1234567890");
    await page.type("#password2", "1234567");
    await page.click("button.signup-btn");

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const text = await page.evaluate(() => {
      const e = document.querySelector("a.error-message");
      return e.textContent;
    });

    console.log(text);
    expect(text).toContain("Passwords must match");
  });
});

describe("sign up already exist account", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`https://${rootUrl}/webpages/html/signup.html`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("signup with account already exist", async () => {
    await page.type("#username", "hozhao@ucsd.edu");
    await page.type("#password1", "1234567");
    await page.type("#password2", "1234567");
    await page.click("button.signup-btn");

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const response = await page.waitForResponse((response) => {
      // Check if the request URL matches the expected URL
      return (
        response
          .url()
          .includes(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp"
          ) && response.status() === 400
      );
    });

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const text = await page.evaluate(() => {
      const e = document.querySelector("a.error-message");
      return e.textContent;
    });

    console.log(text);
    expect(text).toContain("email already exists");
  });
});

describe("invalid email", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`https://${rootUrl}/webpages/html/signup.html`);
  });

  afterAll(async () => {
    await browser.close();
  });

  it("signup with invalid email", async () => {
    await page.type("#username", "hozhao");
    await page.type("#password1", "1234567");
    await page.type("#password2", "1234567");
    await page.click("button.signup-btn");

    // const screenshotPath = "./screenshot.png";
    // await page.screenshot({ path: screenshotPath });

    const response = await page.waitForResponse((response) => {
      // Check if the request URL matches the expected URL
      return (
        response
          .url()
          .includes(
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp"
          ) && response.status() === 400
      );
    });

    const text = await page.evaluate(() => {
      const e = document.querySelector("a.error-message");
      return e.textContent;
    });

    console.log(text);
    expect(text).toContain("Invalid email");
  });
});

// the following test case requires that backend do not have the user.
// may fail if the user exist in the data base.
// describe("success signup", () => {
//   let browser;
//   let page;

//   beforeAll(async () => {
//     browser = await puppeteer.launch();
//     page = await browser.newPage();
//     await page.goto(`https://${rootUrl}/webpages/html/signup.html`);
//   });

//   afterAll(async () => {
//     await browser.close();
//   });

//   it("signup with invalid email", async () => {
//     let home_page = `https://${rootUrl}/webpages/html/home.html`;
//     await page.type("#username", "test@hozhao.com");
//     await page.type("#password1", "1234567");
//     await page.type("#password2", "1234567");
//     await page.click("button.signup-btn");

//     //   const screenshotPath = "./screenshot.png";
//     //   await page.screenshot({ path: screenshotPath });

//     await page.waitForNavigation();
//     console.log(page.url());
//     expect(page.url()).toBe(home_page);
//   });
// });
