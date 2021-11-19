//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine
import CombineExt

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
        
        validatedUsername = username.flatMapLatest {
            Validator.shared.username(username: $0)
        }.driver(onErrorJustReturn: .failed("Invalid username."))
        
        validatedPassword = password.flatMapLatest {
            Validator.shared.password(password: $0)
        }.driver(onErrorJustReturn: .failed("Invalid password"))
        
        let combined = Publishers.CombineLatest(validatedUsername, validatedPassword)
        
        enabled = combined.flatMapLatest { username, password -> Driver<Bool> in
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
