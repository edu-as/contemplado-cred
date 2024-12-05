import puppeteer from 'puppeteer';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { WebSocketServer } from 'ws';

const port = 8081;
const wss = new WebSocketServer({ port });

// Função para fazer o scraping dos dados
async function scrapeData() {
    const url = 'https://fragaebitelloconsorcios.com.br/contemplados';
    const browser = await puppeteer.launch({ headless: true, args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // Executa em um único processo
        '--disable-extensions',] });
    const page = await browser.newPage();

    // forçar o Puppeteer a ignorar erro de SSL
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (req.isNavigationRequest() && req.redirectChain().length) {
           req.continue();
        } else {
            req.continue();
        }
    });

    // Definir algumas configurações para evitar bloqueio
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 }) 
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 }); //timeout: 60000 para produçao
    await page.waitForSelector('table'); // Aguarda a tabela

    const data = await page.evaluate(() => {
        const rows = Array.from(document.querySelectorAll('table tbody tr'));
        return rows.map(row => {
            const cells = row.querySelectorAll('td');
            return Array.from(cells).map(cell => {
                const img = cell.querySelector('img'); // Verifica se há uma imagem na célula
                return img ? img.src : cell.innerText.trim(); // Retorna a URL da imagem ou o texto
            });
        });
    });

    await browser.close();
    return data;
}

// Função para monitorar mudanças
async function monitorData() {
    const newData = await scrapeData();
    const filePath = 'tableData.json';

    if (existsSync(filePath)) {
        const oldData = JSON.parse(readFileSync(filePath, 'utf-8'));

        if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
            console.log('Mudanças detectadas nos dados!');
            writeFileSync(filePath, JSON.stringify(newData, null, 2));

            // Envia os novos dados para todos os clientes conectados via WebSocket
            wss.clients.forEach(client => {
                if (client.readyState === client.OPEN) {
                    client.send(JSON.stringify(newData));
                }
            });
        }
    } else {
        // Salva os dados pela primeira vez
        writeFileSync(filePath, JSON.stringify(newData, null, 2));
    }
}

// Monitora a cada 3 segundos (ajuste conforme necessário)
setInterval(monitorData, 3000);

console.log(`Servidor WebSocket iniciado na porta ${port}`);
