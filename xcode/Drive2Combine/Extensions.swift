//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine
import UIKit.UITextField

typealias Driver<T> = AnyPublisher<T, Never>

extension UITextField {
    func textDriver() -> Driver<String> {
        textPublisher
            .replaceNil(with: "")
            .share()
            .receive(on: RunLoop.main, options: nil)
            .eraseToAnyPublisher()
    }
}

extension Publisher {
    func driver(onErrorJustReturn: Output) -> Driver<Output> {
        `catch` { error -> AnyPublisher<Output, Never> in
            Just(onErrorJustReturn).eraseToAnyPublisher()
        }
        .share()
        .receive(on: RunLoop.main, options: nil)
        .eraseToAnyPublisher()
    }

    func driver() -> Driver<Output> {
        `catch` { error -> AnyPublisher<Output, Never> in
            Empty(completeImmediately: true).eraseToAnyPublisher()
        }
        .share()
        .receive(on: RunLoop.main, options: nil)
        .eraseToAnyPublisher()
    }
}
