//Copyright © 2021 Scott Orlyck. All rights reserved.

import Foundation

struct Post: Decodable, Hashable {
    let id: Int
    let title: String
    let body: String
    let userId: Int
}

struct User: Decodable, Hashable {
    let id: Int
    let name: String
    let email: String
    let phone: String
    let website: String
}
