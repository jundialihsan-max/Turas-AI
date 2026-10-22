import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle, 
  HelpCircle, 
  RotateCw, 
  Award, 
  ArrowRight, 
  Flame, 
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Download
} from 'lucide-react';
import { LearningModule, Lesson, QuizQuestion, Flashcard, UserPreferences } from '../../types';
import { storage } from '../../utils/storage';

interface LearnViewProps {
  modules: LearningModule[];
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: Partial<UserPreferences>) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  modules,
  preferences,
  onUpdatePreferences,
}) => {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(modules[0] || null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [showFlashcards, setShowFlashcards] = useState<boolean>(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Certificate Modal state
  const [showCertificate, setShowCertificate] = useState(false);

  const handleStartLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setShowQuiz(false);
    setShowFlashcards(false);
  };

  const handleCompleteCurrentLesson = () => {
    if (!activeLesson || !selectedModule) return;
    const updated = storage.markLessonComplete(activeLesson.id, selectedModule.id);
    onUpdatePreferences(updated);
    setActiveLesson(null);
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setActiveLesson(null);
    setShowFlashcards(false);
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScore(0);
    setIsQuizCompleted(false);
  };

  const handleOptionSelect = (index: number) => {
    if (!isAnswerSubmitted) {
      setSelectedOption(index);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !selectedModule) return;
    setIsAnswerSubmitted(true);
    const currentQ = selectedModule.quiz[currentQuizIndex];
    if (selectedOption === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (!selectedModule) return;
    if (currentQuizIndex < selectedModule.quiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsQuizCompleted(true);
      // If passed quiz with >= 50%, mark module as completed
      const finalScore = quizScore + (selectedOption === selectedModule.quiz[currentQuizIndex].correctIndex ? 1 : 0);
      if (finalScore >= Math.ceil(selectedModule.quiz.length / 2)) {
        const updated = storage.markLessonComplete('module_' + selectedModule.id, selectedModule.id);
        onUpdatePreferences(updated);
      }
    }
  };

  const isModuleCompleted = selectedModule
    ? preferences.completedModules.includes(selectedModule.id)
    : false;

  return (
    <div className="space-y-6 pb-16">
      {/* Module Overview Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-700">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Pusat Pembelajaran Islam Sistematis
              </h1>
              <p className="text-xs text-stone-600">
                Tingkatkan ilmu syar'i melalui kurikulum berjenjang, dalil autentik, dan evaluasi pemahaman.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200/80 text-xs">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>Target: {preferences.dailyGoalMinutes}m</span>
            </div>
            <span>·</span>
            <span className="text-stone-600 font-medium">
              Selesai: {preferences.completedLessons.length} Materi
            </span>
          </div>
        </div>

        {/* Level selector tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {modules.map((m) => {
            const isSelected = selectedModule?.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedModule(m);
                  setActiveLesson(null);
                  setShowQuiz(false);
                  setShowFlashcards(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition active:scale-95 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-900 text-amber-200 shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>{m.level}: {m.title.slice(0, 26)}...</span>
                {preferences.completedModules.includes(m.id) && (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedModule && !activeLesson && !showQuiz && !showFlashcards && (
        <div className="space-y-6">
          {/* Active Module Banner Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-amber-50 rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-amber-300 border border-emerald-600/40">
                Tingkat {selectedModule.level}
              </span>
              <span className="font-arabic text-lg text-emerald-200" dir="rtl">
                {selectedModule.titleAr}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              {selectedModule.title}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-2xl">
              {selectedModule.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 border-t border-emerald-800/60">
              <span><strong>Sasaran:</strong> {selectedModule.targetAudience}</span>
              <span>·</span>
              <span><strong>Durasi:</strong> ~{selectedModule.estimatedHours} Jam Belajar</span>
              <span>·</span>
              <span><strong>Materi:</strong> {selectedModule.lessons.length} Pelajaran</span>
            </div>

            {/* Quick interactive shortcuts */}
            <div className="pt-4 flex flex-wrap gap-2.5">
              <button
                onClick={() => handleStartLesson(selectedModule.lessons[0])}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mulai Pelajaran 1</span>
              </button>

              <button
                onClick={handleStartQuiz}
                className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-amber-200 border border-emerald-600/50 font-semibold text-xs rounded-xl transition flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Kuis Pemahaman ({selectedModule.quiz.length} Soal)</span>
              </button>

              <button
                onClick={() => {
                  setShowFlashcards(true);
                  setCurrentCardIndex(0);
                  setIsFlipped(false);
                }}
                className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-amber-200 border border-emerald-600/50 font-semibold text-xs rounded-xl transition flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                <span>Kartu Hafalan Musthalah</span>
              </button>

              {isModuleCompleted && (
                <button
                  onClick={() => setShowCertificate(true)}
                  className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Sertifikat Selesai</span>
                </button>
              )}
            </div>
          </div>

          {/* Lessons List for this module */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Daftar Materi Pelajaran
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {selectedModule.lessons.map((lesson) => {
                const isCompleted = preferences.completedLessons.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    onClick={() => handleStartLesson(lesson)}
                    className="bg-white rounded-xl border border-stone-200 p-4 hover:border-emerald-700/60 transition cursor-pointer flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          Materi #{lesson.number}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" /> Selesai
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-sm text-stone-900 truncate">
                        {lesson.title}
                      </h4>
                      <p className="text-xs text-stone-500 truncate">{lesson.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] text-stone-400 hidden sm:inline">
                        ~{lesson.durationMinutes} Menit
                      </span>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Lesson Reading View */}
      {activeLesson && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase font-mono text-emerald-800 font-semibold">
                Materi {activeLesson.number} dari {selectedModule?.lessons.length}
              </span>
              <h2 className="text-xl font-serif font-bold text-stone-900 mt-1">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-stone-500">{activeLesson.subtitle}</p>
            </div>
            <button
              onClick={() => setActiveLesson(null)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
            >
              Kembali ke Modul
            </button>
          </div>

          {/* Lesson Content Paragraphs */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed">
            {activeLesson.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Key Dalil Box */}
          {activeLesson.keyDalil.length > 0 && (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                Dalil Pokok Pelajaran:
              </span>
              {activeLesson.keyDalil.map((dalil, dIdx) => (
                <div key={dIdx} className="space-y-2">
                  <p className="font-arabic text-xl text-stone-900 text-right leading-relaxed" dir="rtl">
                    {dalil.arabic}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 italic">"{dalil.indonesian}"</p>
                  <p className="text-[11px] text-stone-500 font-medium">Sumber: {dalil.source}</p>
                </div>
              ))}
            </div>
          )}

          {/* Summary Box */}
          <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-4 text-xs text-emerald-950 space-y-1">
            <strong className="text-emerald-900">Ringkasan Pelajaran:</strong>
            <p className="leading-relaxed">{activeLesson.summary}</p>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setActiveLesson(null)}
              className="text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Kembali
            </button>
            <button
              onClick={handleCompleteCurrentLesson}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold shadow-xs flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-amber-300" />
              <span>Tandai Selesai & Lanjutkan</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Quiz Mode */}
      {showQuiz && selectedModule && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          {!isQuizCompleted ? (
            <>
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-xs uppercase font-mono text-amber-700 font-semibold">
                    Kuis Evaluasi Pemahaman
                  </span>
                  <p className="text-xs text-stone-500">
                    Pertanyaan {currentQuizIndex + 1} dari {selectedModule.quiz.length}
                  </p>
                </div>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-800"
                >
                  Keluar Kuis
                </button>
              </div>

              {/* Question Text */}
              <div className="space-y-4">
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                  {selectedModule.quiz[currentQuizIndex].question}
                </h3>

                {/* Multiple choice options */}
                <div className="space-y-2.5">
                  {selectedModule.quiz[currentQuizIndex].options.map((option, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === selectedModule.quiz[currentQuizIndex].correctIndex;
                    let optionStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-50 border-rose-600 text-rose-950';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-amber-50 border-amber-500 font-semibold text-stone-900';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(optIdx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation after submitting */}
                {isAnswerSubmitted && (
                  <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs space-y-1.5 animate-fade-in">
                    <strong className="text-stone-800">Penjelasan & Sumber Dalil:</strong>
                    <p className="text-stone-700 leading-relaxed">
                      {selectedModule.quiz[currentQuizIndex].explanation}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono">
                      Rujukan: {selectedModule.quiz[currentQuizIndex].sourceDalil}
                    </p>
                  </div>
                )}
              </div>

              {/* Submit or Next Button */}
              <div className="pt-4 border-t border-stone-100 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-semibold text-xs shadow-xs disabled:opacity-40"
                  >
                    Kirim Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 font-semibold text-xs shadow-xs"
                  >
                    {currentQuizIndex < selectedModule.quiz.length - 1 ? 'Soal Berikutnya' : 'Lihat Hasil Akhir'}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed Score Summary */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Kuis Evaluasi Selesai!
              </h3>
              <p className="text-sm text-stone-600">
                Skor Anda: <strong className="text-emerald-800 text-base">{quizScore}</strong> dari {selectedModule.quiz.length} Soal
              </p>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {quizScore >= Math.ceil(selectedModule.quiz.length / 2)
                  ? 'Alhamdulillah, pemahaman Anda terhadap dalil dan materi ini sangat baik.'
                  : 'Tetap semangat, silakan ulangi kembali materi untuk memperkuat pemahaman dalil.'}
              </p>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleStartQuiz}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Ulangi Kuis
                </button>
                <button
                  onClick={() => setShowQuiz(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold shadow-xs"
                >
                  Kembali ke Modul
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interactive Flashcards (Kartu Hafalan) */}
      {showFlashcards && selectedModule && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase font-mono text-amber-700 font-semibold">
                Kartu Hafalan Istilah Syar'i (Flashcard)
              </span>
              <p className="text-xs text-stone-500">
                Kartu {currentCardIndex + 1} dari {selectedModule.flashcards.length}
              </p>
            </div>
            <button
              onClick={() => setShowFlashcards(false)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-800"
            >
              Tutup Flashcard
            </button>
          </div>

          {/* Flashcard container with flip interaction */}
          {selectedModule.flashcards[currentCardIndex] && (
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-56 p-8 rounded-2xl bg-gradient-to-br from-stone-50 to-amber-50/50 border-2 border-dashed border-amber-300 hover:border-amber-400 cursor-pointer flex flex-col items-center justify-center text-center transition-all shadow-inner space-y-4"
            >
              {!isFlipped ? (
                <>
                  <span className="text-xs font-mono uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    {selectedModule.flashcards[currentCardIndex].category}
                  </span>
                  <h4 className="font-arabic text-3xl font-bold text-emerald-950" dir="rtl">
                    {selectedModule.flashcards[currentCardIndex].termAr}
                  </h4>
                  <h3 className="font-serif font-bold text-lg text-stone-800">
                    {selectedModule.flashcards[currentCardIndex].termId}
                  </h3>
                  <span className="text-[11px] text-stone-400">
                    (Ketuk kartu untuk melihat definisi dan dalil)
                  </span>
                </>
              ) : (
                <div className="space-y-3 animate-fade-in">
                  <span className="text-xs font-bold text-emerald-900 uppercase">
                    Definisi & Faidah:
                  </span>
                  <p className="text-sm text-stone-800 leading-relaxed font-medium">
                    {selectedModule.flashcards[currentCardIndex].definition}
                  </p>
                  <p className="text-xs text-stone-600 bg-white/80 p-2.5 rounded-lg border border-amber-200 italic">
                    {selectedModule.flashcards[currentCardIndex].dalilProof}
                  </p>
                  <span className="text-[11px] text-stone-400">
                    (Ketuk untuk kembali)
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Navigation between flashcards */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                if (currentCardIndex > 0) {
                  setCurrentCardIndex(currentCardIndex - 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentCardIndex === 0}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold disabled:opacity-40"
            >
              Sebelumnya
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-amber-800 font-semibold underline"
            >
              Balik Kartu
            </button>

            <button
              onClick={() => {
                if (currentCardIndex < selectedModule.flashcards.length - 1) {
                  setCurrentCardIndex(currentCardIndex + 1);
                  setIsFlipped(false);
                }
              }}
              disabled={currentCardIndex === selectedModule.flashcards.length - 1}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold disabled:opacity-40"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* Certificate of Module Completion Modal */}
      {showCertificate && selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-stone-900 space-y-5 text-center">
            <div className="space-y-1">
              <span className="font-arabic text-xl text-emerald-900" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Sertifikat Penyelesaian Modul Belajar
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Al-Maktabah Al-Islamiyyah Digital Reference
              </p>
            </div>

            <div className="p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <p className="text-xs text-stone-600">Diberikan kepada:</p>
              <h4 className="text-lg font-bold text-emerald-950 font-serif">
                {preferences.userName || 'Penuntut Ilmu'}
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                Telah menyelesaikan seluruh materi dan evaluasi pemahaman pada modul:
              </p>
              <p className="text-sm font-bold text-stone-900">
                "{selectedModule.title}"
              </p>
              <p className="text-[11px] text-stone-500">
                Tanggal: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Honest disclaimer per prompt instructions */}
            <div className="text-[11px] text-stone-500 italic bg-stone-50 p-2.5 rounded-lg border border-stone-200">
              *Catatan Amanah Ilmiah: Sertifikat ini merupakan tanda penyelesaian modul aplikasi digital, bukan merupakan ijazah agama, sanad keilmuan, atau pengakuan kompetensi fatwa para ulama.
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert('Sertifikat berhasil disiapkan. Anda dapat menyimpan tampilan layar (screenshot) sebagai tanda penyelesaian.');
                }}
                className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-100 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan / Unduh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
