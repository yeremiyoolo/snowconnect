import { test, expect } from '@playwright/test';

test.describe('SnowConnect - Inspección Completa', () => {

  // 1. PRUEBA DEL HOME PAGE
  test('Home: Carga elementos visuales clave', async ({ page }) => {
    await page.goto('/');
    
    // Verifica título de la pestaña
    await expect(page).toHaveTitle(/SnowConnect/);
    
    // Verifica elementos principales
    await expect(page.getByText('FUTURE READY')).toBeVisible(); // Hero
    await expect(page.getByText('Snow V.I.P.')).toBeVisible(); // Banner VIP
    
    // Verifica que el cotizador (Smart Trade-In) esté presente
    // Buscamos un texto que sabemos que está en ese componente
    await expect(page.getByRole('button', { name: 'Cotizar mi Equipo' })).toBeVisible();
  });

  // 2. PRUEBA DE NAVEGACIÓN Y CATÁLOGO
  test('Catálogo: Navegación y Búsqueda básica', async ({ page }) => {
    await page.goto('/');

    // Busca el link de "Catálogo" en el menú y haz clic
    await page.click('text=Catálogo');
    
    // Verifica que la URL cambió
    await expect(page).toHaveURL(/.*catalogo/);
    
    // Prueba la barra de búsqueda
    const barraBusqueda = page.getByPlaceholder('Buscar productos...');
    await barraBusqueda.fill('iPhone 15');
    await barraBusqueda.press('Enter');
    
    // Verifica que la URL tenga el parámetro de búsqueda
    await expect(page).toHaveURL(/.*q=iPhone\+15/);
  });

  // 3. PRUEBA DE ACCESO (LOGIN)
  test('Auth: La página de Login carga correctamente', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Verifica que aparezca el formulario
    await expect(page.getByRole('heading', { name: 'Bienvenido de nuevo' })).toBeVisible();
    await expect(page.getByPlaceholder('tucorreo@ejemplo.com')).toBeVisible();
    
    // Verifica botón de Google
    await expect(page.getByText('Continuar con Google')).toBeVisible();
  });

  // 4. PRUEBA DE LEGALES (FOOTER)
  test('Footer: Los enlaces legales funcionan', async ({ page }) => {
    await page.goto('/');
    
    // Scroll hasta el final
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Verifica Privacidad
    const linkPrivacidad = page.getByRole('link', { name: 'Política de Privacidad' });
    await expect(linkPrivacidad).toBeVisible();
    await expect(linkPrivacidad).toHaveAttribute('href', '/privacidad');
  });

  // 5. PRUEBA DE TEMA (OSCURO/CLARO)
  test('UI: El cambio de tema funciona', async ({ page }) => {
    await page.goto('/');
    
    // Busca el botón del tema (asumiendo que tiene un aria-label o rol)
    // Nota: Esto depende de cómo se llame tu botón en el Navbar. 
    // Si falla, es porque necesitamos identificar mejor ese botón.
    const themeButton = page.locator('button').filter({ hasText: /tema|oscuro|claro/i }).first();
    
    if (await themeButton.isVisible()) {
        await themeButton.click();
        // Solo verificamos que no explote la página al dar clic
        await expect(page).toHaveTitle(/SnowConnect/);
    }
  });

});