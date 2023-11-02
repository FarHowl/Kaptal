import os

def count_lines_of_code(directory, file_extensions):
    total_lines = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(tuple(file_extensions)):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    total_lines += len(lines)
    return total_lines

# Укажите путь к вашему проекту
project_directory = "C:\\Users\\dima3\\OneDrive\\Документы\\GitHub\\Kaptal"

# Укажите расширения файлов, которые вы хотите учитывать
file_extensions = ['.js', '.jsx']

total_lines_of_code = count_lines_of_code(project_directory, file_extensions)
print(f"Всего строк кода в проекте: {total_lines_of_code}")
