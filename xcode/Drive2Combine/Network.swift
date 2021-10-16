//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation
import Combine

class Network {
    static let shared = Network()
    let decoder: JSONDecoder = JSONDecoder()
    let session: URLSession = URLSession.shared
}

enum Response {
    case success
    case error(String?)
}

extension Network {

    //datatask publisher
//    func fetch() -> Driver<Response> {
//        session.dataTaskPublisher(for: URL(string: "https://jsonplaceholder.typicode.com/posts")!)
//            .map { data, _ -> Data in
//                data
//            }
//            .decode(type: [Post].self, decoder: decoder)
//            .map { posts -> Response in
//                .success(posts)
//            }.driver()
//    }

    func login(username: String, password: String) -> AnyPublisher<Response, Never> {
        Just(.success).eraseToAnyPublisher()
    }
}
