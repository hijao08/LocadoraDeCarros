import { test, expect } from '@playwright/test';

test.describe('Locadora de Carros - Testes Básicos', () => {
  test('deve carregar a página inicial', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Locadora de Carros/);
    await expect(page.getByText('CRUD de Veículos')).toBeVisible();
  });

  test('deve listar veículos', async ({ page }) => {
    await page.goto('/');
    
    // Clicar no botão para atualizar a listagem
    await page.getByRole('button', { name: 'Atualizar Listagem' }).click();
    
    // Esperar por itens na tabela
    await page.waitForTimeout(1000);
    
    // Verificar se algum veículo foi carregado
    const tabela = page.locator('table tbody');
    const conteudoTabela = await tabela.textContent();
    
    // Verifica se não aparece a mensagem "No items"
    const semItens = await page.locator('text=No items').isVisible();
    expect(!semItens || conteudoTabela?.includes('Rentcars') || conteudoTabela?.includes('Honda')).toBeTruthy();
  });

  test('deve adicionar um novo veículo', async ({ page }) => {
    await page.goto('/');
    
    // Preencher o formulário
    await page.locator('input[name="rental_company"]').fill('TesteCarro');
    await page.locator('input[name="model"]').fill('Modelo Teste');
    await page.locator('input[name="brand"]').fill('Marca Teste');
    await page.locator('input[name="year"]').fill('2024');
    await page.locator('input[name="engine"]').fill('1.6');
    await page.locator('input[name="doors"]').fill('4');
    await page.locator('select[name="shift_model"]').selectOption('Manual');
    await page.locator('input[name="air_conditioner"]').check();
    
    // Clicar no botão adicionar
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Esperar pela adição
    await page.waitForTimeout(1000);
    
    // Atualizar a listagem
    await page.getByRole('button', { name: 'Atualizar Listagem' }).click();
    
    // Verificar se o novo veículo foi adicionado
    await page.waitForTimeout(1000);
    
    // Buscar por texto do carro adicionado
    const conteudoTabela = await page.locator('table tbody').textContent();
    expect(conteudoTabela?.includes('TesteCarro') || conteudoTabela?.includes('Modelo Teste')).toBeTruthy();
  });

  // Teste adicional de API com Playwright
  test('deve verificar a API de veículos', async ({ request }) => {
    const response = await request.get('http://localhost:3333/veiculos');
    expect(response.ok()).toBeTruthy();
    
    const veiculos = await response.json();
    expect(Array.isArray(veiculos)).toBeTruthy();
    expect(veiculos.length).toBeGreaterThan(0);
  });
}); 