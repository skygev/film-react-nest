# FILM!

## Установка

### База данных

Проект поддерживает два драйвера:

* `postgres` (основной сценарий для текущей конфигурации);
* `mongodb` (опционально).

Выберите драйвер через `DATABASE_DRIVER` в `.env`.

Если используете MongoDB, выполните скрипт `test/mongodb_initial_stub.js` в консоли `mongo`.

### Бэкенд

Перейдите в папку с исходным кодом бэкенда

`cd backend`

Установите зависимости (точно такие же, как в package-lock.json) помощью команд

`npm ci` или `yarn install --frozen-lockfile`

Создайте `.env` файл из примера `.env.example`, в нём укажите:

* `DATABASE_DRIVER` - тип драйвера СУБД (`postgres` или `mongodb`).
* `DATABASE_URL` - адрес СУБД. Для PostgreSQL, например: `postgresql://film:film@127.0.0.1:5432/prac`.
* `LOG_FORMAT` - формат логов: `dev`, `json` или `tskv`.

Выбранная СУБД должна быть установлена и запущена.

Запустите бэкенд:

`npm start:debug`

Для проверки отправьте тестовый запрос с помощью Postman или `curl`.

### Фронтенд

Перейдите в папку фронтенда:

`cd frontend`

Установите зависимости:

`npm ci`

Запуск в dev-режиме:

`npm run dev`

Сборка production-версии:

`npm run build`

Локальный просмотр production-сборки:

`npm run preview`

### Docker

Для полного запуска проекта в контейнерах:

`docker compose up -d --build`

Доступные порты:

* приложение: `http://localhost` (порт `80`);
* pgAdmin: `http://localhost:8080`.

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
