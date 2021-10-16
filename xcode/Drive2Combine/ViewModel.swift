//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine
import CombineExt

enum Validation {
    case success
    case failed(String)
}

class Validator {
    static let shared = Validator()

    func validateUsername(username: String) -> Bool {
        !username.isEmpty
    }

    func validatePassword(password: String) -> Bool {
        !password.isEmpty
    }

    func username(username: String) -> AnyPublisher<Validation, Never> {
        Just(.success).eraseToAnyPublisher()
    }

    func password(password: String) -> AnyPublisher<Validation, Never> {
        Just(.success).eraseToAnyPublisher()
    }
}

class ViewModel {

    //MARK: - OUTPUTS
    let validatedUsername: Driver<Validation>
    let validatedPassword: Driver<Validation>
    let enabled: Driver<Bool>
    let loggedIn: Driver<Response>

    //MARK: - INPUTS
    init(
        username: Driver<String>,
        password: Driver<String>,
        login: AnyPublisher<Void, Never>
    ) {

        validatedUsername = login.withLatestFrom(username).flatMapLatest {
            Validator.shared.username(username: $0)
        }.driver(onErrorJustReturn: .failed("Invalid username."))

        validatedPassword = login.withLatestFrom(password).flatMapLatest {
            Validator.shared.password(password: $0)
        }.driver(onErrorJustReturn: .failed("Invalid password"))

        enabled = Publishers.CombineLatest(validatedUsername, validatedPassword).flatMapLatest { username, password -> Driver<Bool> in
            if case (.success, .success) = (username, password) {
                return Just(true).eraseToAnyPublisher()
        }
            return Just(false).eraseToAnyPublisher()
        }.driver(onErrorJustReturn: false)

        loggedIn = login.withLatestFrom(Publishers.CombineLatest(username, password))
            .flatMapLatest {
                Network.shared.login(username: $0, password: $1)
            }.eraseToAnyPublisher()
    }
}
