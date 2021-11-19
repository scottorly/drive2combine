//Copyright © 2021 Scott Orlyck. All rights reserved.

import UIKit
import Combine
import CombineCocoa

class ViewController: UIViewController {
    
    //MARK: - IBOutlets
    @IBOutlet weak var username: UITextField!
    @IBOutlet weak var usernameError: UILabel!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var passwordError: UILabel!
    @IBOutlet weak var login: UIButton!
    
    @IBOutlet weak var activity: UIActivityIndicatorView!
    @IBOutlet weak var scrollView: UIScrollView!
    
    lazy var viewModel: ViewModel = {
        ViewModel(
            username: username.textDriver(),
            password: password.textDriver(),
            login: login.tapPublisher)
    }()
    
    //trusty dispose bag
    var bag: Set<AnyCancellable> = Set()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        bind()
    }
    
    func bind() {
        viewModel.validatedUsername
            .sink { [weak self] validation in
                if case .failed(let message) = validation {
                    self?.usernameError.text = message
                    self?.usernameError.isHidden = false
                } else {
                    self?.usernameError.isHidden = true
                }
            }
            .store(in: &bag)
        
        viewModel.validatedPassword
            .sink { [weak self] validation in
                if case .failed(let message) = validation {
                    self?.passwordError.text = message
                    self?.passwordError.isHidden = false
                } else {
                    self?.passwordError.isHidden = true
                }
            }.store(in: &bag)

        viewModel.enabled.sink { [weak self] enabled in
            self?.login.isEnabled = enabled
        }.store(in: &bag)

        viewModel.loggedIn.sink { [weak self] response in
            if case .success = response {
                self?.performSegue(withIdentifier: "LOGGEDIN", sender: nil)
            }
        }.store(in: &bag)
    }
    
}

