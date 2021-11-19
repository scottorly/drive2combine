import{P as b,h as e,f as h}from"./vendor.39c9c736.js";const g=function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))m(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&m(d)}).observe(document,{childList:!0,subtree:!0});function u(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function m(t){if(t.ep)return;t.ep=!0;const n=u(t);fetch(t.href,n)}};g();const v="token",w="comment",y="prolog",I="doctype",k="cdata",x="punctuation",P="property",R="tag",T="boolean",N="number",A="constant",M="symbol",E="deleted",S="selector",D="builtin",C="inserted",O="string",L="char",V="operator",U="entity",B="url",H="style",J="atrule",K="keyword",F="regex",$="important",j="variable",q="small",G="code";var f={token:v,comment:w,prolog:y,doctype:I,cdata:k,punctuation:x,property:P,tag:R,boolean:T,number:N,constant:A,symbol:M,deleted:E,selector:S,"attr-name":"attr-name",builtin:D,inserted:C,string:O,char:L,operator:V,entity:U,url:B,"language-css":"language-css",style:H,atrule:J,"attr-value":"attr-value",keyword:K,function:"function","class-name":"class-name",regex:F,important:$,variable:j,"line-highlight":"line-highlight","line-numbers":"line-numbers","linkable-line-numbers":"linkable-line-numbers","line-numbers-rows":"line-numbers-rows",small:q,code:G};const a=({children:r,attributes:{snippet:s,dataline:u}})=>e("figure",null,r,e("p",{className:f.small},e("pre",{"data-line":u},e("code",{className:`${f.code} language-swift`},s)))),o=({children:r,attributes:{href:s}})=>e("a",{target:"_blank",rel:"noreferrer noopener",href:s},r);let c=0,p=0;const i=({children:r})=>(c++,e(h,null,e("label",{for:c,className:"margin-toggle"},"\u2295"),e("input",{type:"checkbox",id:c,className:"margin-toggle"}),e("span",{className:"marginnote"},r))),l=({children:r})=>(p++,e(h,null,e("label",{for:`${p}a`,className:"margin-toggle sidenote-number"}),e("input",{type:"checkbox",id:`${p}a`,className:"margin-toggle"}),e("span",{className:"sidenote"},r))),W=e("article",null,e("section",null,e("h1",null,"DRIVE II: COMBINE"),e("p",{className:"subtitle"},e("a",{href:"https://scottorly.github.io"},"Scott Orlyck"))),e("section",null,e("img",{src:"https://images.unsplash.com/photo-1565647952915-9644fcd446a4?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"}),e("blockquote",null,`"We ain't driving tractors here."`)),e("section",null,e("p",null,e("span",{className:"newthought"},"In our ",e(o,{href:"https://scottorly.github.io/drive"},"last episode")),", we implemented some practical iOS UI programming techniques using RxSwift's ",e(o,{href:"https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver"},"Driver trait")," and UIKit. This time we are going to explore some of the same patterns using Apple's Swift Reactive Programming framework ",e(o,{href:"https://developer.apple.com/documentation/combine"},"Combine"),". Implemented with discipline, Rx based architectures can help you avoid smelly anti-patterns like half-cooked spagehetti",e(l,null,"Not enough seperation of concerns.")," or over-cooked lasgna",e(l,null,"Too much seperation of concerns."),", but it is not without it's costs. One of the biggest problems with Rx architectures is the steep learning curve of not only the reactive language extensions themselves but also learning to reason about the system as an declarative stream of events and data. Lucky for us then that Combine adds some much needed developer ergonomics to reactive extensions that makes things a lot easier when operating on publishers across API boundaries.")),e("section",null,e("h2",null,"THE RETURN OF THE DRIVER"),e("p",null,e(i,null,"Find the source code for a project with working examples  ",e(o,{href:"https://github.com/scottorly/drive2combine/tree/main/xcode"},"here"),".")),e("p",null,"If you recall, RxSwift's ",e(o,{href:"https://github.com/ReactiveX/RxSwift/blob/main/Documentation/Traits.md#driver"},"Driver Trait"),' is a guarantee that the publisher is shared with the last element replayed upon subscription, the subscription is always received on the main thread, and the publisher can never error out. It is instructive to think about Drivers as UI or system events "driving the application".'),e("p",null,"One of the main driver's",e(l,null,"I am so sorry.")," of the RxSwift Driver trait was to help make dealing with type inference across API boundaries less problematic. This is problem is solved with Combine's convenient ",e(o,{href:"https://developer.apple.com/documentation/combine/just/erasetoanypublisher()"},"eraseToAnyPublisher")," API."),e("p",null,"Below is a simple extension to Publisher to fulfill our requirements for a Driver."),e(a,{snippet:`import Combine
import CombineExt
                
typealias Driver<T> = AnyPublisher<T, Never>

extension Publisher {
    func driver() -> Driver<Output> {
        \`catch\` { error -> AnyPublisher<Output, Never> in
            Empty(completeImmediately: true).eraseToAnyPublisher()
        }
        .share(replay: 1)
        .receive(on: RunLoop.main)
        .eraseToAnyPublisher()
    }
}`,dataline:"8-12"},e(i,{id:"b"},"Lines 8-9: Catch and return an Empty publisher to convert the error type to Never.",e("br",null),"Line 11: Share and replay the last element.",e("br",null),"Line 12: Receive on the main thread.")),e(a,{snippet:`extension Publisher {
    func driver(onErrorReturn: Output) -> Driver<Output> {
        \`catch\` { error -> AnyPublisher<Output, Never> in
            Just(onErrorReturn).eraseToAnyPublisher()
        }
        .share(replay: 1)
        .receive(on: RunLoop.main)
        .eraseToAnyPublisher()
    }
}`,dataline:"4"},e(i,null,"If you want to provide a default value to the driver function wrap the default value parameter in a Just publisher instead of returning an Empty publisher."))),e("section",null,e("h2",null,"DONT CALL IT MVVM THIS IS MVVMVC"),e("p",null,"One of the really nice things about Combine when compared to RxSwift is that the API is much simpler than RxSwift's. The simplicity does introduce a drawback however - we need to import CombineExt to provide some operators missing from Combine in order to use Combine with UIKit effectively. Nonetheless our code is going to look a lot cleaner thanks to the integration with Foundation. As with RxSwift and RxCocoa Apple does not provide default publishers for UIKit control events so we will need to add CombineCocoa to our project as well."),e("p",null,"Take a look at the ViewModel implementation below as now is a good time to review some rules",e(l,null,"The ViewModel cannot import UIKit and will never subscribe to any publishers.")," to help enforce seperation of concerns and prevent side effects."),e(a,{snippet:`import CombineExt

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
`,dataline:""},e(i,null,e("br",null))),e("p",null),e(a,{snippet:`class ViewController: UIViewController {
    
    //MARK: - IBOutlets
    @IBOutlet weak var username: UITextField!
    @IBOutlet weak var password: UITextField!
    @IBOutlet weak var login: UIButton!

    lazy var viewModel: ViewModel = {
        ViewModel(
            username: username.textDriver(),
            password: password.textDriver(),
            login: login.tapPublisher)
    }()

}`},e(i,null," ")),e(a,{snippet:`func bind() {
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
}`},e(i,null," "))),e("section",null,e("h3",null,"Acknowledgements"),e("p",null,"Styles by ",e(o,{href:"https://edwardtufte.github.io/tufte-css/"},"Tufte-CSS"),"."),e("p",null,"Syntax by ",e(o,{href:"https://prismjs.com/"},"PrismJS"))));document.body.appendChild(W);b.highlightAll();
