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
            return .failed("Username required.")
        }
        return .success
    }

    func validatePassword(password: String) -> Validation {
        if password.isEmpty {
            return .failed("Password required.")
        }
        return .success
    }

    func username(username: String) -> Just<Validation> {
        Just(validateUsername(username: username))
    }

    func password(password: String) -> Just<Validation> {
        Just(validatePassword(password: password))
    }
}
