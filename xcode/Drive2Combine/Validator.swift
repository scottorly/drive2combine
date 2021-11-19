//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine

enum Validation {
    case success
    case failed(String)
}

class Validator {
    static let shared = Validator()

    func validateUsername(username: String) -> Validation {
        if username.isEmpty {
            return .failed("")
        }
        return .success
    }

    func validatePassword(password: String) -> Validation {
        if password.isEmpty {
            return .failed("")
        }
        return .success
    }

    func username(username: String) -> AnyPublisher<Validation, Never> {
        Just(validateUsername(username: username)).eraseToAnyPublisher()
    }

    func password(password: String) -> AnyPublisher<Validation, Never> {
        Just(validatePassword(password: password)).eraseToAnyPublisher()
    }
}
