export const REPOSITORIES_DI_TYPES = {
  UserRepository: Symbol.for('UserRepository'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
  PasswordResetTokenRepository: Symbol.for('PasswordResetTokenRepository'),
  FormQuestionRepository: Symbol.for('FormQuestionRepository'),
  FormQuestionAnswerRepository: Symbol.for('FormQuestionAnswerRepository'),
  ServiceRepository: Symbol.for('ServiceRepository'),
  ServiceCategoryRepository: Symbol.for('ServiceCategoryRepository'),
  PodcastReservationRepository: Symbol.for('PodcastReservationRepository'),
  ServiceReservationRepository: Symbol.for('ServiceReservationRepository'),
  ReservationStatusHistoryRepository: Symbol.for('ReservationStatusHistoryRepository'),
  ReservationNoteRepository: Symbol.for('ReservationNoteRepository'),
  AnalyticsRepository: Symbol.for('AnalyticsRepository'),
};