import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

(async () => {
    const url = 'https://fragaebitelloconsorcios.com.br/contemplados';
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Aguarda a tabela carregar
    await page.waitForSelector('table');

    // Extrai os dados da tabela
    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).map(cell => cell.innerText.trim());
        });
    });

    console.log(data);

    // Salva os dados em um arquivo JSON
    writeFileSync('tableData.json', JSON.stringify(data, null, 2));

    await browser.close();
})();
