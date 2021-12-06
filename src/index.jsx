import './tufte.module.css'
import styles from './styles.module.css'
import Prism from 'prismjs'
import 'prismjs/plugins/line-highlight/prism-line-highlight'
import 'prismjs/components/prism-swift'

const metas = <>
    <meta name="Description" content="Drive II: Combine, Functional Reactive Programming with Combine & UIKit by Scott Orlyck"/>
    <meta name="twitter:title" content="Drive II: Combine"/>
    <meta name="twitter:description" content=""/>
    <meta name="twitter:image" content=""/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content=""/>
    <meta name="twitter:creator" content="@orlyck"/>
    <meta property="og:url" content=""/>
    <meta property="og:title" content="Drive"/>
    <meta property="og:description" content=""/>
    <meta property="og:image" content=""/>
    <meta property="og:image:secure" content=""/>
</>

const Code = ({ children, attributes: { snippet, dataline }}) => (
<>
    <p>
        {children}
    </p>
    <figure className={styles.small}>
            <pre data-line={dataline} >
                <code className={`${styles.code} language-swift`}>
                    { snippet }
                </code>
            </pre>
    </figure>
</>
)

const Link = ({ children, attributes: { href }}) => (
    <a target="_blank" rel="noreferrer noopener" href={href}>
        {children}
     </a>
)

let marginNoteId = 0
let sideNoteId = 0

const MarginNote = ({ children }) => {
    marginNoteId++
    return (<>
        <label for={marginNoteId} className="margin-toggle">&#8853;</label>
        <input type="checkbox" id={marginNoteId} className="margin-toggle"/>
        <span className="marginnote">
            { children }
        </span>
    </>)
}

const SideNote = ({ children }) => {
    sideNoteId++
    return <>
            <label for={`${sideNoteId}a`} className="margin-toggle sidenote-number"/>
            <input type="checkbox" id={`${sideNoteId}a`} className="margin-toggle"/>
            <span className="sidenote">
                { children }
            </span>
        </>
}

const blog = (
    <article>
        <section>
            <h1>
                DRIVE II: COMBINE
            </h1>
            <p className="subtitle">
                <a href='https://scottorly.github.io'>Scott Orlyck</a>
            </p>
        </section>

        <section>
            <img src="https://images.unsplash.com/photo-1565647952915-9644fcd446a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"/>
            <blockquote>"We ain't driving tractors here."</blockquote>
        </section>

        <section>

            <p>
                <span className='newthought'>In our <Link href="https://scottorly.github.io/drive">last episode</Link></span>, we implemented some practical iOS UI programming techniques using RxSwift's <Link href="https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver">Driver trait</Link> and UIKit. This time we are going to explore some of the same patterns using Apple's reactive programming framework <Link href="https://developer.apple.com/documentation/combine">Combine</Link>. Implemented with discipline, Rx based architectures can help you avoid smelly anti-patterns like half-cooked spagehetti<SideNote>Not enough seperation of concerns.</SideNote> or over-cooked lasgna<SideNote>Too much seperation of concerns.</SideNote>, but as with all things it comes with trade-offs.</p>
                
                <p>One of the biggest problems with Rx architectures is the steep learning curve of not only the reactive language extensions themselves but also learning to reason about the system as a declarative stream of events and data as opposed to imperative statefulness. Lucky for us then that Combine adds some much needed developer ergonomics to reactive extensions that makes things a lot easier when operating on publishers across API boundaries.
            </p>
        </section>

        <section>
            <h2>THE RETURN OF THE DRIVER</h2>
    <p><MarginNote>Find the source code for a project with working examples  <Link href='https://github.com/scottorly/drive2combine/tree/main/xcode'>here</Link>.</MarginNote></p>
            <p>
                If you recall, RxSwift's <Link href="https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver">Driver Trait</Link> is a guarantee that the publisher is shared with the last element replayed upon subscription, the subscription is always received on the main thread, and the publisher can never error out. It is instructive to think about Drivers as UI or system events "driving the application".
            </p>

            <p>
                One of the main drivers<SideNote>I am so sorry.</SideNote> of the RxSwift Driver trait was to help make dealing with type inference across API boundaries less problematic. Combine's convenient <Link href={`https://developer.apple.com/documentation/combine/just/erasetoanypublisher()`}>eraseToAnyPublisher</Link> API makes this aspect of the driver trait redundant however it is instructive to walk through the implementation with Combine and the result leaves us with some easily re-usable Rx patterns.
            </p>
            <p>
                One of the nice things about Combine compared to RxSwift is that the API is much simpler. The primary drawback of this simplicity is that we will need to import CombineExt to provide some operators we need for this architecture pattern to be successful. Nonetheless our code is going to look a lot cleaner thanks to Combine's integration with Foundation. Apple does not provide default publishers for UIKit control events so we will need to add CombineCocoa to our project as well.
            </p>
            <p>
                Below are two extensions to Publisher to fulfill our requirements for a Driver. The first demonstrates how to use an <Link href='https://developer.apple.com/documentation/combine/empty'>Empty</Link> publisher to convert a Publisher error type to Never.
            </p>
            <Code snippet={`import CombineExt
                
typealias Driver<T> = AnyPublisher<T, Never>
typealias Bag = Set<AnyCancellable>

extension Publisher {
    func driver() -> Driver<Output> {
        \`catch\` { error -> AnyPublisher<Output, Never> in
            Empty(completeImmediately: true).eraseToAnyPublisher()
        }
        .share(replay: 1)
        .receive(on: RunLoop.main)
        .eraseToAnyPublisher()
    }
}`} dataline={'3-4,8-12'}>
                <MarginNote id='b'>
                    Lines 3-4: Some typealias conveniences.
                    <br />
                    Lines 8-9: Catch and return an Empty publisher to convert the error type to Never.
                    <br />
                    Line 11: Share and replay the last element.
                    <br />
                    Line 12: Receive on the main thread.
                </MarginNote>
            </Code>

        <Code snippet={`func driver(onErrorJustReturn: Output) -> Driver<Output> {
    \`catch\` { error -> Just<Output> in
        Just(onErrorJustReturn)
    }
    .share(replay: 1)
    .receive(on: RunLoop.main, options: nil)
    .eraseToAnyPublisher()
}`} 
                 dataline={'3'}>
                    <MarginNote>If it makes more sense to provide a default value to the driver function wrap the default value parameter in a Just publisher instead of returning an Empty publisher.
                    </MarginNote>
                </Code>
           
                {/*  */}
        <Code snippet={`extension UITextField {
    func textDriver() -> Driver<String> {
        textPublisher.replaceNil(with: "").driver()
    }
}`} dataline={'3'}>
                    <MarginNote>One more extension for our UITextfield publisher so we don't have to worry about unwrapping optionals anywhere along our publisher chain.
                    </MarginNote>
                </Code>
        </section>
        <section>
            <h2>MVVM + VC</h2>
            <p>
                We can't accurately call this pattern MVVM becuase it's more like Model-View-ViewModel-ViewController. The ViewController is responsible for connecting the ViewModel to the Views as well as managing the navigation stack which is exactly what UIViewControllers are supposed to do!
            </p>
            <p>
                Take a look at the ViewModel implementation below as now is a good time to review some rules<SideNote>The ViewModel cannot import UIKit and will never subscribe to any publishers.</SideNote> to help enforce seperation of concerns and prevent side effects.
            </p>
            <Code snippet={`import Combine
import CombineExt

class ViewModel {
    
    let validatedUsername: Driver<Validation>
    let validatedPassword: Driver<Validation>
    let enabled: Driver<Bool>
    let loggedIn: Driver<Response>
`} dataline=''>
            <MarginNote>
                <br />
            </MarginNote>
        </Code>

        <p>
            We initialize the ViewModel with out IBOutlet driver parameters.
        </p>
        <Code snippet={`init(
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
`} dataline='1,6,10'>
            <MarginNote>
                <br />
            </MarginNote>
        </Code>
        <p></p>
        <Code snippet={`    let combined = Publishers.CombineLatest(
        validatedUsername,
        validatedPassword
    )

    enabled = combined
        .flatMapLatest { username, password -> Just<Bool> in
            if case (.success, .success) = (username, password) {
                return Just(true)
            }
            return Just(false)
        }.driver(onErrorJustReturn: false)

    let combinedCredentials = Publishers
        .CombineLatest(
            username,
            password
        )

    loggedIn = login.withLatestFrom(combinedCredentials)
        .flatMapLatest {
            Network.shared.login(username: $0, password: $1)
        }.driver()`} dataline='1,6,14,20'>
            <MarginNote>
                <br />
            </MarginNote>
        </Code>
        <p>
            The ViewModel isn't too much different than last time except now it is significantly simpler. Define the outputs, connect the inputs and subscribe in the ViewController. Bish bash bosh, next thing you know, Robert's your father's brother.
        </p>

        <p>
            One thing we wont be implementing here is the drive function itself which serves as a type erased replacement for subscribe in RxSwift. Combine's built-in type erasure has already made our API boundaries tidy and easy to work with.
        </p>

        <Code snippet={`import CombineCocoa

class ViewController: UIViewController {
    
    @IBOutlet weak var username: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var login: UIButton!

    var bag = Bag()

    lazy var viewModel: ViewModel = {
        ViewModel(
            username: username.textDriver(),
            password: password.textDriver(),
            login: login.tapPublisher)
    }()

}`} dataline='5,6,7,9,11'>
            <MarginNote> </MarginNote> 
        </Code>
        <p>
            Back in our ViewController we can start to connect the ViewModel outputs to the Views.
        </p>
        <Code snippet={`viewModel.validatedUsername
    .sink { [weak self] validation in
        if case .failed(let message) = validation {
            self?.usernameError.text = message
            self?.usernameError.isHidden = false
        } else {
            self?.usernameError.isHidden = true
        }
    }.store(in: &bag)

    viewModel.validatedPassword
        .sink { [weak self] validation in
            if case .failed(let message) = validation {
                self?.passwordError.text = message
                self?.passwordError.isHidden = false
            } else {
                self?.passwordError.isHidden = true
            }
    }.store(in: &bag)`} dataline=''>
            <MarginNote>
                Since the ViewModel outputs are all Drivers we can rest assured that our subscriptions will be received on the main thread.
            </MarginNote> 
        </Code>

        <p>
            Now we can connect the login button enabled state and the request result outlets.
        </p> 
        <Code snippet={`viewModel.enabled.sink { [weak self] enabled in
    self?.login.isEnabled = enabled
}.store(in: &bag)

viewModel.loggedIn.sink { [weak self] response in
    if case .success = response {
        self?.performSegue(withIdentifier: "LOGGEDIN", sender: nil)
    }
}.store(in: &bag)`}>
            <MarginNote>As always, don't forget to use weak self, put the subscriptions in the bag, and call your bind function in viewDidLoad.</MarginNote> 
        </Code>

        </section>

        <section>
            <h2>IN THE BAG</h2>
            <p>
                Until next time ;)
            </p>
        </section>
        <section>
            <h3>Acknowledgements</h3>
            <p>
                Styles by <Link href="https://edwardtufte.github.io/tufte-css/">Tufte-CSS</Link>.
            </p>
            <p>
                 Syntax by <Link href="https://prismjs.com/">PrismJS</Link>
            </p>
        </section>
        <footer>
        <em>Copyright © 2021 Scott Orlyck. All rights reserved.</em>
        </footer>
    </article>
)

document.body.appendChild(blog)

Prism.highlightAll()