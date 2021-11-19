//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine
import CombineExt
import UIKit.UITextField

typealias Driver<T> = AnyPublisher<T, Never>

extension UITextField {
    func textDriver() -> Driver<String> {
        textPublisher
            .replaceNil(with: "")
            .share(replay: 1)
            .eraseToAnyPublisher()
    }
}

extension Publisher {
    //provide a default value to return on error
    func driver(onErrorJustReturn: Output) -> Driver<Output> {
        `catch` { error -> Just<Output> in
            Just(onErrorJustReturn)
        }
        .share(replay: 1)
        .receive(on: RunLoop.main, options: nil)
        .eraseToAnyPublisher()
    }

    //replace the error with an Empty publisher
    func driver() -> Driver<Output> {
        `catch` { error -> Empty in
            Empty(completeImmediately: true)
        }
        .share(replay: 1)
        .receive(on: RunLoop.main, options: nil)
        .eraseToAnyPublisher()
    }
}
