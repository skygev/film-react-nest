# FILM!

## Установка

### MongoDB

Установите MongoDB скачав дистрибутив с официального сайта или с помощью пакетного менеджера вашей ОС. Также можно воспользоваться Docker (см. ветку `feat/docker`.

Выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД - в нашем случае это `mongodb` 
* `DATABASE_URL` - адрес СУБД MongoDB, например `mongodb://127.0.0.1:27017/practicum`.  

MongoDB должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

## REST API

После запуска приложения по умолчанию доступны следующие эндпоинты (с глобальным префиксом `http://localhost:3000/api/afisha`):

| Метод | Путь | Назначение |
| --- | --- | --- |
| `GET` | `/films` | Получить список фильмов с поддержкой параметра `date` для фильтрации по дате сеанса |
| `GET` | `/films/:id/schedule` | Получить расписание конкретного фильма |
| `POST` | `/order` | Создать заказ на билеты |

Пример запроса:

```bash
curl http://localhost:3000/api/afisha/films
curl http://localhost:3000/api/afisha/films/dune-2/schedule
curl -X POST http://localhost:3000/api/afisha/order \
  -H "Content-Type: application/json" \
  -d '{"filmId":"dune-2","sessionId":"session-1","ticketsCount":2,"email":"user@example.com"}'
```

## Статический контент

Файлы афиши раздаются напрямую по пути `http://localhost:3000/content/afisha/*`. Например, `http://localhost:3000/content/afisha/bg1c.jpg`.
