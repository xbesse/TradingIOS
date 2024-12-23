// Classe de gestion des dates
export default class TimeStamp {
  constructor(year, month, day, hour, minute) {
    this.year = year.toString().padStart(4, '0');    // Année sur 4 chiffres
    this.month = month.toString().padStart(2, '0');  // Mois sur 2 chiffres
    this.day = day.toString().padStart(2, '0');      // Jour sur 2 chiffres
    this.hour = hour.toString().padStart(2, '0');    // Heure sur 2 chiffres
    this.minute = minute.toString().padStart(2, '0'); // minute sur 2 chiffres
  }

  static fromDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return new TimeStamp(year, month, day, hour, minute);
  }

  static fromString(str) {
    // Format attendu: "YYYY-MM-DD-HH-MM"
    const [year, month, day, hour, minute] = str.split('-');
    return new TimeStamp(
      parseInt(year),
      parseInt(month),
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}-${this.hour}-${this.minute}`;
  }

  toStandardString() {
    return `${this.year}-${this.month}-${this.day}T${this.hour}:${this.minute}:00`;
  }

  toChartString() {
    return `${this.hour}:${this.minute}`;
  }

  toDate() {
    return new Date(
      parseInt(this.year),
      parseInt(this.month) - 1,
      parseInt(this.day),
      parseInt(this.hour),
      parseInt(this.minute)
    );
  }

  // Pour le tri et la comparaison
  static compare(a, b) {
    const aStr = a.toString();
    const bStr = b.toString();
    if (aStr < bStr) return -1;
    if (aStr > bStr) return 1;
    return 0;
  }
}
