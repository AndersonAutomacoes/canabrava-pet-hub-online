
const { createDriver, By, until } = require('./selenium.config');

describe('Navigation Tests', () => {
  let driver;

  beforeEach(async () => {
    driver = createDriver();
    await driver.get('http://localhost:5173');
  });

  afterEach(async () => {
    await driver.quit();
  });

  test('should navigate to products page', async () => {
    const productLink = await driver.findElement(By.linkText('Produtos'));
    await productLink.click();
    
    await driver.wait(until.urlContains('/produtos'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/produtos');
  });

  test('should navigate to agendamento page', async () => {
    const agendamentoLink = await driver.findElement(By.linkText('Agendamento'));
    await agendamentoLink.click();
    
    await driver.wait(until.urlContains('/agendamento'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain('/agendamento');
  });

  test('should open mobile menu', async () => {
    await driver.manage().window().setRect({ width: 375, height: 667 });
    
    const menuButton = await driver.findElement(By.css('[data-testid="mobile-menu-button"]'));
    await menuButton.click();
    
    const mobileNav = await driver.wait(
      until.elementLocated(By.css('[data-testid="mobile-nav"]')),
      5000
    );
    expect(await mobileNav.isDisplayed()).toBe(true);
  });
});
