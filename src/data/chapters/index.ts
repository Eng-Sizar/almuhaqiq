import { Chapter } from '../../types';
import { CASE_1 } from './case1';
import { CASE_2 } from './case2';
import { CASE_3 } from './case3';
import customCases from '../cases/custom-cases.json';
import { validateCustomCases } from '../cases/validateCustomCases';

const validatedCustomCases = validateCustomCases(customCases);

export const ALL_CHAPTERS: Chapter[] = [
  CASE_1,
  CASE_2,
  CASE_3,
  ...validatedCustomCases
].sort((first, second) => first.number - second.number);

export function getChapterById(chapterId: string): Chapter | undefined {
  return ALL_CHAPTERS.find(c => c.id === chapterId);
}

export function getNextChapter(currentChapterId: string): Chapter | undefined {
  const currentIndex = ALL_CHAPTERS.findIndex(c => c.id === currentChapterId);
  if (currentIndex >= 0 && currentIndex < ALL_CHAPTERS.length - 1) {
    return ALL_CHAPTERS[currentIndex + 1];
  }
  return undefined;
}
