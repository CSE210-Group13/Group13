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

describe("user log in", () => {
  beforeAll(async () => {
    await page.goto(`https://${rootUrl}/webpages/html/home.html`);
  });

  it("navigate to login.html", async () => {
    let login_page = `https://${rootUrl}/webpages/html/login.html`; 
    console.log(page.url());
    expect(page.url()).toBe(login_page);
  });
});
