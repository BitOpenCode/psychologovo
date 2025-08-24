-- Обновление существующей таблицы irfit_schedules (если нужно добавить недостающие поля)
-- Проверяем, какие поля уже есть, и добавляем недостающие

-- Добавляем поля для аудита, если их нет
DO $$ 
BEGIN
    -- Добавляем created_by_id если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'irfit_schedules' AND column_name = 'created_by_id') THEN
        ALTER TABLE irfit_schedules ADD COLUMN created_by_id BIGINT REFERENCES irfit_users(id);
    END IF;
    
    -- Добавляем created_by_name если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'irfit_schedules' AND column_name = 'created_by_name') THEN
        ALTER TABLE irfit_schedules ADD COLUMN created_by_name VARCHAR(128);
    END IF;
    
    -- Добавляем updated_by_id если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'irfit_schedules' AND column_name = 'updated_by_id') THEN
        ALTER TABLE irfit_schedules ADD COLUMN updated_by_id BIGINT REFERENCES irfit_users(id);
    END IF;
    
    -- Добавляем updated_by_name если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'irfit_schedules' AND column_name = 'updated_by_name') THEN
        ALTER TABLE irfit_schedules ADD COLUMN updated_by_name VARCHAR(128);
    END IF;
    
    -- Добавляем update_reason если его нет
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'irfit_schedules' AND column_name = 'update_reason') THEN
        ALTER TABLE irfit_schedules ADD COLUMN update_reason TEXT;
    END IF;
END $$;

-- Создание индексов для оптимизации запросов (если их нет)
CREATE INDEX IF NOT EXISTS idx_irfit_schedules_date ON irfit_schedules(date);
CREATE INDEX IF NOT EXISTS idx_irfit_schedules_teacher ON irfit_schedules(teacher);
CREATE INDEX IF NOT EXISTS idx_irfit_schedules_class_type ON irfit_schedules(class_type);
CREATE INDEX IF NOT EXISTS idx_irfit_schedules_is_active ON irfit_schedules(is_active);
CREATE INDEX IF NOT EXISTS idx_irfit_schedules_created_by_id ON irfit_schedules(created_by_id);

-- Создание таблицы для логирования использования расписания (если её нет)
CREATE TABLE IF NOT EXISTS schedule_usage_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES irfit_users(id),
    action VARCHAR(100),
    schedule_id BIGINT REFERENCES irfit_schedules(id),
    schedule_title VARCHAR(255),
    teacher_name VARCHAR(128),
    class_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для таблицы логов
CREATE INDEX IF NOT EXISTS idx_schedule_usage_log_user_id ON schedule_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_usage_log_schedule_id ON schedule_usage_log(schedule_id);
CREATE INDEX IF NOT EXISTS idx_schedule_usage_log_created_at ON schedule_usage_log(created_at);

-- Комментарии к таблицам
COMMENT ON TABLE irfit_schedules IS 'Таблица расписания занятий IRFit';
COMMENT ON TABLE schedule_usage_log IS 'Лог использования расписания для аналитики';

-- Примеры данных для тестирования (можно удалить в продакшене)
-- Добавляем только если таблица пустая
INSERT INTO irfit_schedules (title, teacher, room, class_type, level, max_participants, start_time, end_time, date, rating, created_by_name) 
SELECT * FROM (
    VALUES
    ('Утренняя йога', 'Елена Петрова', 'Зал №1', 'Йога', 'Начинающий', 15, '09:00'::time, '10:30'::time, '2024-12-20'::date, 4.8, 'Администратор'),
    ('Функциональный тренинг', 'Александр Иванов', 'Зал №2', 'Силовая', 'Средний', 10, '11:00'::time, '12:00'::time, '2024-12-20'::date, 4.9, 'Администратор'),
    ('Кардио HIIT', 'Мария Смирнова', 'Зал №3', 'Кардио', 'Продвинутый', 15, '14:00'::time, '15:00'::time, '2024-12-20'::date, 4.7, 'Администратор'),
    ('Пилатес', 'Анна Козлова', 'Зал №1', 'Пилатес', 'Начинающий', 12, '18:00'::time, '19:30'::time, '2024-12-20'::date, 4.6, 'Администратор'),
    ('Вечерняя йога', 'Елена Петрова', 'Зал №1', 'Йога', 'Средний', 15, '19:45'::time, '21:00'::time, '2024-12-20'::date, 4.8, 'Администратор')
) AS v(title, teacher, room, class_type, level, max_participants, start_time, end_time, date, rating, created_by_name)
WHERE NOT EXISTS (SELECT 1 FROM irfit_schedules LIMIT 1); 