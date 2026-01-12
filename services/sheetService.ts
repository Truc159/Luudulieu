
import { Student } from '../types';

/**
 * Service to handle Google Sheets operations.
 * This interacts with a Google Apps Script Web App.
 */
export const sheetService = {
  /**
   * Fetch all students from the Google Sheet
   */
  async fetchStudents(url: string): Promise<Student[]> {
    if (!url) return [];
    try {
      const response = await fetch(`${url}?action=read`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      return data as Student[];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  /**
   * Add a new student to the Google Sheet
   */
  async addStudent(url: string, student: Omit<Student, 'id' | 'createdAt'>): Promise<boolean> {
    if (!url) return false;
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Google Apps Script POST requests often need no-cors for simple implementation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          data: {
            ...student,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          }
        }),
      });
      // With no-cors, we can't read the response body, but the request is sent
      return true;
    } catch (error) {
      console.error('Error adding student:', error);
      return false;
    }
  }
};
