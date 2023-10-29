import requests
import concurrent.futures

# URL вашей веб-страницы
url = 'http://frontend.local.app.garden/book/6537784690071ba0abfd98dc'  # Замените на реальный URL страницы книги

# Функция для отправки запроса на указанный URL
def send_request(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            print(f'Successful request to {url}')
    except Exception as e:
        print(f'Failed request to {url}: {e}')

# Количество одновременных запросов (в этом случае 10)
num_requests = 10

# Используем concurrent.futures для отправки запросов параллельно
with concurrent.futures.ThreadPoolExecutor(max_workers=num_requests) as executor:
    # Повторяем отправку запросов 100 раз (в этом случае)
    for _ in range(1000):
        # Отправляем указанное количество запросов параллельно
        executor.map(send_request, [url] * num_requests)