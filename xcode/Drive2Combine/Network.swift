//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine
import CombineExt

enum Response {
    case success
}

class Network {

    static let shared = Network()

    func login(username: String, password: String) -> AnyPublisher<Response, Never> {
        AnyPublisher.create { subscription in
            DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
                subscription.send(.success)
            }
            return AnyCancellable {}
        }
        .receive(on: RunLoop.main)
        .eraseToAnyPublisher()
    }
}
