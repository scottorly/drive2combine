import './tufte.module.css'
import styles from './styles.module.css'
import Prism from 'prismjs'
import 'prismjs/plugins/line-highlight/prism-line-highlight'

import 'prismjs/components/prism-swift'

{/* <meta name="Description" content="Drive II: Combine, Functional Reactive Programming with Combine & UIKit by Scott Orlyck">
<meta name="twitter:title" content="Drive II: Combine">
<meta name="twitter:description" content="">
<meta name="twitter:image" content="">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="">
<meta name="twitter:creator" content="@orlyck">
<meta property="og:url" content="">
<meta property="og:title" content="Drive">
<meta property="og:description" content="">
<meta property="og:image" content="">
<meta property="og:image:secure" content=""> */}

const Code = ({ children, attributes: { snippet, dataline }}) => (
    <figure>
        { children }
        <p className={styles.small}>
            <pre data-line={dataline} >
                <code className={`${styles.code} language-swift`}>
                    { snippet }
                </code>
            </pre>
        </p>
    </figure>
)

const Link = ({ children, attributes: { href }}) => (
    <a target="_blank" rel="noreferrer noopener" href={href}>
        {children}
     </a>
)

const MarginNote = ({ children }) => (
    <>
        <label for="mn-demo" className="margin-toggle">&#8853;</label>
        <input type="checkbox" id="mn-demo" className="margin-toggle"/>
        <span className="marginnote">
            { children }
        </span>
    </>
)

const SideNote = ({ children }) => (
    <>
        <label for="sn-demo" className="margin-toggle sidenote-number"/>
        <input type="checkbox" id="sn-demo" className="margin-toggle"/>
        <span className="sidenote">
            { children }
        </span>
    </>
)

const blog = (
    <article>
        <section>
            <h1>
                Drive II: Combine
            </h1>
            <p className="subtitle">
                <a href='https://linktr.ee/orlyck'>Scott Orlyck</a>
            </p>
        </section>

        <section>
            <img src="https://images.unsplash.com/photo-1565647952915-9644fcd446a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"/>
            <blockquote>"We ain't driving tractors here."</blockquote>
        </section>

        <section>

            <p>
                <span className='newthought'>In our <Link href="https://scottorly.github.io/drive-blog">last episode</Link></span>, we implemented some practical UI techniques using Rx<SideNote><Link href="https://en.wikipedia.org/wiki/ReactiveX">ReactiveX</Link>: Reactive Programming Extensions</SideNote> with RxSwift's <Link href="https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver">Driver Trait</Link> and UIKit. 
            </p>
            <p>
                Below we are going to explore some of the same patterns (and a few new ones) using Apple's Swift Reactive Programming framework <Link href="https://developer.apple.com/documentation/combine">Combine</Link>. The compiler magic Apple has baked into Xcode add welcome ergonomics to the otherwise frustrating climb up the Rx learning curve. Rx based architectures can be a powerful tool to facilitate clean architecture so you can avoid half-cooked spagehetti<SideNote>Not enough seperation of concerns</SideNote> or over-cooked lasgna<SideNote>Too many seperation of concerns</SideNote> and maybe we'll find that Combine leads to cleaner and simpler code than RxSwift.
            </p>

        </section>

        <section>
            <h2>The Return of the Driver</h2>
            <p>
                If you recall RxSwift's Driver trait is a guarantee that the publisher is shared, the subscription is always received on the main thread and the publisher can never error out. It is instructive to think about Drivers as UI or system events "driving the application".
            </p>
            <p>

            </p>
            <Code snippet={`import Combine
import CombineExt
                
typealias Driver<T> = AnyPublisher<T, Never>

extension Publisher {
    func driver(onErrorReturn: Output) -> Driver<Output> {
        \`catch\` { error -> AnyPublisher<Output, Never> in
            Just(onErrorReturn).eraseToAnyPublisher()
        }
        .share(replay: 1)
        .receive(on: RunLoop.main, options: nil)
        .eraseToAnyPublisher()
    }
}`} 
                dataline={'4,6,7,8,11,12'} >
                    <MarginNote>Line 4: Typealias declaration. 
                        <br />
                        Line 6: Catch and return an Empty publisher to convert the error type to Never.
                        <br />
                        Line 7: Parameter to return if there instead of an error when replacing the error type.
                        <br/>
                        Line 8: Note the use of backticks in the function name.
                        <br/>
                        Line 11: Share with replay of 1.
                        <br />
                        Line 12: Receive downstream subscriptions on the main thread.
                    </MarginNote>
                </Code>
            <Code snippet={`extension Publisher {

    func driver() -> Driver<Output> {
        \`catch\` { error -> AnyPublisher<Output, Never> in
            Empty(completeImmediately: true).eraseToAnyPublisher()
        }
        .share()
        .receive(on: RunLoop.main, options: nil)
        .eraseToAnyPublisher()
    }
}`} 
                dataline={'4,6,7,11'} >
                    <MarginNote>Line 4: Typealias declaration. 
                        <br />
                        Line 6: Catch and return an Empty publisher to convert the error type to Never.
                        <br />
                        Line 7: Note the use of backticks in the function name.
                        <br/>
                        Line 11:
                        <br />
                        Line 12:
                    </MarginNote>
                </Code>
        </section>

        <section>
            <h2>
                <Link href="https://developer.apple.com/documentation/uikit/uitableviewdiffabledatasource">
                    Diffable Datasources
                </Link>
            </h2>

            <p>
                For this tutorial we are going to explore another new iOS platform component that can help simplify our collection views especially handling datasources updates without the dreaded inconsistency crash.
            </p>

            <p>
               
               
               
                Available in iOS 13 and above, Diffable Datasources can be used with UITableView and UICollectionView and are much cleaner implementations than the overly verbose traditional datasource and delegate methods.
            </p>

            <Code snippet={`import UIKit

typealias Datasource = UITableViewDiffableDataSource<Int, Post>
typealias Snapshot = NSDiffableDataSourceSnapshot<Int, Post>
`
                }>
                    <MarginNote>Assign the datasource property to the UITableView and create a new snapshot appending a new section and a new item to the section.</MarginNote> 
                </Code>

            <p>
                Now we can setup our datasource and load some test items.
            </p>

            <Code snippet={`class ViewController: UIViewController {

    @IBOutlet weak var tableView: UITableView!

    lazy var datasource: Datasource = {
        Datasource(tableView: tableView) { tableView, indexPath, item in
            tableView.dequeueReusableCell(withIdentifier: "CELL")
        }
    }()
}`
             }>
                <MarginNote>Assign the datasource property to the UITableView and create a new snapshot appending a new section and a new item to the section.</MarginNote> 
            </Code>

            <Code snippet={`class ViewController: UIViewController {
    func viewDidLoad() {
        super.viewDidLoad()
        tableView.datasource = datasource
        var snapshot = 
    }
}`
        }>
            <MarginNote>Assign the datasource property to the UITableView and create a new snapshot appending a new section and a new item to the section.</MarginNote> 
        </Code>

        </section>
        <section>
            <Code snippet={`class ViewModel {

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

        validatedUsername = login.withLatestFrom(username).flatMapLatest {
            Validator.shared.username(username: $0)
        }.driver()

        validatedPassword = login.withLatestFrom(password).flatMapLatest {
            Validator.shared.password(password: $0)
        }.driver()

        enabled = Publishers.CombineLatest(validatedUsername, validatedPassword)
        .flatMapLatest { username, password -> Driver<Bool> in
            if case (.success, .success) = (username, password) {
                return Just(true).driver()
            }
            return Just(false).driver()
        }.driver()

        loggedIn = login.withLatestFrom(Publishers.CombineLatest(username, password))
            .flatMapLatest {
                Network.shared.login(username: $0, password: $1)
            }.eraseToAnyPublisher()
    }
}`} dataline='1,8-14'>
            <MarginNote>Assign the datasource property to the UITableView and create a new snapshot appending a new section and a new item to the section.</MarginNote>
        
        </Code>

        <Code snippet={`func bind() {
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

    }.store(in: &bag)

    viewModel.loggedIn.sink { [weak self] response in

    }.store(in: &bag)
}
        `}>
            <MarginNote> </MarginNote> 
        </Code>
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
    </article>
)

document.body.appendChild(blog)

Prism.highlightAll()