import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Type, 
  Hash, 
  Clock, 
  Copy, 
  Trash2, 
  BookOpen,
  AlignLeft,
  List
} from 'lucide-react';

function App() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const sentences = text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const readingTime = Math.ceil(words / 200); // Среднее время чтения 200 слов в минуту

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      lines,
      readingTime
    };
  }, [text]);

  const handleClear = () => {
    setText('');
  };

  const copyStats = () => {
    const statsText = `Статистика текста:
Слова: ${stats.words}
Символы: ${stats.characters}
Символы без пробелов: ${stats.charactersNoSpaces}
Предложения: ${stats.sentences}
Абзацы: ${stats.paragraphs}
Строки: ${stats.lines}
Время чтения: ${stats.readingTime} мин`;
    
    navigator.clipboard.writeText(statsText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Счетчик Слов
              </h1>
              <p className="text-gray-600 text-sm">Анализируйте ваш текст в реальном времени</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Type size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Слова</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.words.toLocaleString()}</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Hash size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Символы</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.characters.toLocaleString()}</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Hash size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Без пробелов</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.charactersNoSpaces.toLocaleString()}</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <BookOpen size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Предложения</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.sentences.toLocaleString()}</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <AlignLeft size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Абзацы</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.paragraphs.toLocaleString()}</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                <List size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Строки</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.lines.toLocaleString()}</div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <Clock size={18} />
              </div>
              <div className="text-sm font-medium text-gray-600">Чтение</div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.readingTime} мин</div>
          </div>
        </div>

        {/* Main Editor */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Введите ваш текст</h2>
            <div className="flex gap-2">
              <button
                onClick={copyStats}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Copy size={16} />
                Копировать статистику
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Trash2 size={16} />
                Очистить
              </button>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Начните вводить текст здесь... Статистика будет обновляться автоматически."
            className="w-full h-96 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-800 leading-relaxed bg-white/50 backdrop-blur-sm placeholder-gray-400"
          />

          {text && (
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Быстрая статистика:</strong> {stats.words} слов, {stats.characters} символов, {stats.lines} строк, {stats.sentences} предложений
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">О приложении</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Этот счетчик слов предоставляет детальную статистику вашего текста в реальном времени. 
              Идеально подходит для писателей, студентов, блогеров и всех, кто работает с текстом.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Функции</h3>
            <ul className="text-gray-600 text-sm space-y-2">
              <li>• Подсчет слов, символов и предложений</li>
              <li>• Подсчет строк и абзацев</li>
              <li>• Анализ структуры текста</li>
              <li>• Оценка времени чтения</li>
              <li>• Копирование статистики</li>
              <li>• Адаптивный дизайн для всех устройств</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;