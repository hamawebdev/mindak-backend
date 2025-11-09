export const USE_CASES_DI_TYPES = {
  CreateUserUseCase: Symbol.for('CreateUserUseCase'),
  LoginUseCase: Symbol.for('LoginUseCase'),
  GetCurrentUserUseCase: Symbol.for('GetCurrentUserUseCase'),
  RefreshTokenUseCase: Symbol.for('RefreshTokenUseCase'),
  ForgotPasswordUseCase: Symbol.for('ForgotPasswordUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  ChangePasswordUseCase: Symbol.for('ChangePasswordUseCase'),

  // Form Management Use Cases
  // Podcast Form Questions
  GetPodcastQuestionsUseCase: Symbol.for('GetPodcastQuestionsUseCase'),
  CreatePodcastQuestionUseCase: Symbol.for('CreatePodcastQuestionUseCase'),
  UpdatePodcastQuestionUseCase: Symbol.for('UpdatePodcastQuestionUseCase'),
  DeletePodcastQuestionUseCase: Symbol.for('DeletePodcastQuestionUseCase'),
  ReorderPodcastQuestionsUseCase: Symbol.for('ReorderPodcastQuestionsUseCase'),

  // Question Answers
  GetQuestionAnswersUseCase: Symbol.for('GetQuestionAnswersUseCase'),
  CreateQuestionAnswerUseCase: Symbol.for('CreateQuestionAnswerUseCase'),
  UpdateQuestionAnswerUseCase: Symbol.for('UpdateQuestionAnswerUseCase'),
  DeleteQuestionAnswerUseCase: Symbol.for('DeleteQuestionAnswerUseCase'),
  ReorderQuestionAnswersUseCase: Symbol.for('ReorderQuestionAnswersUseCase'),

  // Services Form Questions
  GetServicesQuestionsUseCase: Symbol.for('GetServicesQuestionsUseCase'),
  CreateServicesQuestionUseCase: Symbol.for('CreateServicesQuestionUseCase'),
  UpdateServicesQuestionUseCase: Symbol.for('UpdateServicesQuestionUseCase'),
  DeleteServicesQuestionUseCase: Symbol.for('DeleteServicesQuestionUseCase'),
  ReorderServicesQuestionsUseCase: Symbol.for('ReorderServicesQuestionsUseCase'),

  // Client Form Questions
  GetClientPodcastQuestionsUseCase: Symbol.for('GetClientPodcastQuestionsUseCase'),
  GetClientServicesQuestionsUseCase: Symbol.for('GetClientServicesQuestionsUseCase'),

  // Service Management Use Cases
  GetAllServicesUseCase: Symbol.for('GetAllServicesUseCase'),
  GetServiceByIdUseCase: Symbol.for('GetServiceByIdUseCase'),
  CreateServiceUseCase: Symbol.for('CreateServiceUseCase'),
  UpdateServiceUseCase: Symbol.for('UpdateServiceUseCase'),
  DeleteServiceUseCase: Symbol.for('DeleteServiceUseCase'),
  ToggleServiceStatusUseCase: Symbol.for('ToggleServiceStatusUseCase'),
  BulkUpdateServiceStatusUseCase: Symbol.for('BulkUpdateServiceStatusUseCase'),
  GetActiveServicesUseCase: Symbol.for('GetActiveServicesUseCase'),

  // Reservation Management Use Cases
  // Client Submission
  SubmitPodcastReservationUseCase: Symbol.for('SubmitPodcastReservationUseCase'),
  SubmitServiceReservationUseCase: Symbol.for('SubmitServiceReservationUseCase'),
  GetReservationConfirmationUseCase: Symbol.for('GetReservationConfirmationUseCase'),

  // Admin - Podcast Reservations
  ListPodcastReservationsUseCase: Symbol.for('ListPodcastReservationsUseCase'),
  GetPodcastReservationDetailsUseCase: Symbol.for('GetPodcastReservationDetailsUseCase'),
  GetPodcastClientDataUseCase: Symbol.for('GetPodcastClientDataUseCase'),
  UpdatePodcastReservationStatusUseCase: Symbol.for('UpdatePodcastReservationStatusUseCase'),
  AddPodcastReservationNoteUseCase: Symbol.for('AddPodcastReservationNoteUseCase'),
  DeletePodcastReservationUseCase: Symbol.for('DeletePodcastReservationUseCase'),

  // Admin - Service Reservations
  ListServiceReservationsUseCase: Symbol.for('ListServiceReservationsUseCase'),
  GetServiceReservationDetailsUseCase: Symbol.for('GetServiceReservationDetailsUseCase'),
  GetServiceClientDataUseCase: Symbol.for('GetServiceClientDataUseCase'),
  UpdateServiceReservationStatusUseCase: Symbol.for('UpdateServiceReservationStatusUseCase'),
  AddServiceReservationNoteUseCase: Symbol.for('AddServiceReservationNoteUseCase'),
  DeleteServiceReservationUseCase: Symbol.for('DeleteServiceReservationUseCase'),

  // Analytics Use Cases
  GetDashboardMetricsUseCase: Symbol.for('GetDashboardMetricsUseCase'),
  GetPodcastAnalyticsUseCase: Symbol.for('GetPodcastAnalyticsUseCase'),
  GetServiceAnalyticsUseCase: Symbol.for('GetServiceAnalyticsUseCase'),
  GetTrendAnalysisUseCase: Symbol.for('GetTrendAnalysisUseCase'),
  GetTopServicesUseCase: Symbol.for('GetTopServicesUseCase'),
  GetRealtimeDashboardUseCase: Symbol.for('GetRealtimeDashboardUseCase'),
};