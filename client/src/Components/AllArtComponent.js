import React, { Component } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Col,
    Card,
    CardImg,
    CardTitle,
    CardBody,
    CardText,
    Modal,
    ModalHeader,
    ModalBody
} from 'reactstrap';
import Web3 from 'web3';

let allDocs = [];
class AllArt extends Component {
    constructor(props) {
        super(props);
        this.state = { docCount: 0, art: [], isModalOpen: false, qty: 0 };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.buyItem = this.buyItem.bind(this);
    }
    buyItem = async () => {
        const res = await this.props.contract.methods
            .buyToken(this.props.art.tokenIdentifier)
            .send({
                from: this.props.accounts,
                value: this.props.art.tokenSellPrice,
                gas: 1000000
            });
        console.log(res);
    };
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    render() {
        var but = this.props.art.isSelling ? 'visible' : 'invisible';
        var bux = this.props.art.isSelling ? 'invisible' : 'visible';
        var bak = this.props.art.isSelling ? 'bg-success text-white' : '';
        var artno = this.props.art.tokenIdentifier;
        var cl = 'fa fa-laptop fa-5x';
        var pr =
            Web3.utils.fromWei(
                this.props.art.tokenSellPrice.toString(),
                'ether'
            ) == 0
                ? 'invisible'
                : 'visible';
        return (
            <Card className={bak}>
                <CardImg
                    top
                    width='100%'
                    src={this.props.art.imgurl}
                    alt='Card image'
                />
                <CardBody>
                    <CardTitle>
                        Item Title : {this.props.art.tokenTitle}
                    </CardTitle>
                    <CardText>
                        <small>
                            Item Creator : {this.props.art.tokenCreator}
                        </small>
                    </CardText>
                    <CardText>
                        <small>Item Owner : {this.props.art.tokenOwner}</small>
                    </CardText>
                    <CardText className={but}>
                        <small>
                            Item Sell Price :{' '}
                            {Web3.utils.fromWei(
                                this.props.art.tokenSellPrice.toString(),
                                'ether'
                            )}{' '}
                            ETH
                        </small>
                    </CardText>
                    <Col sm={{ size: 12 }}>
                        <Button
                            className={but}
                            size='sm'
                            type='submit'
                            color='primary'
                            onClick={this.buyItem}
                        >
                            Buy Item
                        </Button>
                        {'   '}
                        <Button
                            className={bux}
                            size='sm'
                            type='submit'
                            color='primary'
                        >
                            Place Offer
                        </Button>
                    </Col>
                </CardBody>
            </Card>
        );
    }
}

class AllItemComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            docCount: 0,
            art: [],
            cust: [],
            manuf: [],
            isModalOpen1: false,
            title: '',
            arturl: '',
            price: '',
            arthash: '',
            percut: 0
        };
        this.toggleModal1 = this.toggleModal1.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        //this.com = this.com.bind(this);
    }

    toggleModal1() {
        this.setState({
            isModalOpen1: !this.state.isModalOpen1
        });
    }

    creatingItems = async () => {
        var tokenhash = this.state.arthash.toString();
        var tokentitle = this.state.title;
        var tokenprice = this.state.price;
        var imgurl = this.state.arturl;
        var percut = this.state.percut;
        console.log(tokenhash, tokentitle, tokenprice, imgurl, percut);
        const res = await this.props.contract.methods
            .create(tokenhash, tokentitle, tokenprice, imgurl, percut)
            .send({ from: this.props.accounts, gas: 1000000 });
        console.log(res);

        this.toggleModal1();
    };

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    async componentDidMount() {
        var res = await this.props.contract?.methods.tokenCount().call();
        console.log(res);

        var response = [];
        for (var i = 1; i <= res; i++) {
            var rex = await this.props.contract?.methods.Arts(i).call();
            response.push(rex);
        }
        allDocs = [];
        allDocs = response;
        console.log(response);
        this.setState({ art: allDocs });
    }

    render() {
        const Menu = this.state.art.map((x) => {
            return (
                <div key={x} className='col-4 col-md-3'>
                    <AllArt
                        art={x}
                        contract={this.props.contract}
                        accounts={this.props.accounts}
                    />
                    <br />
                    <br />
                </div>
            );
        });

        var ch = 'visible';
        return (
            <div className='container'>
                <h2>All Items</h2>

                <Modal
                    isOpen={this.state.isModalOpen1}
                    toggle={this.toggleModal1}
                    className='modal-xl'
                >
                    <ModalHeader toggle={this.toggleModal1}>
                        <h3>Add Artwork</h3>
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <div className='row pl-5 pr-5'>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label htmlFor='title' className='ml-3'>
                                            Token Title
                                        </Label>
                                        <Input
                                            type='text'
                                            id='title'
                                            name='title'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label htmlFor='price' className='ml-3'>
                                            Item Price
                                        </Label>
                                        <Input
                                            type='text'
                                            id='price'
                                            name='price'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <div className='row pl-5 pr-5'>
                                <div className='col-12'>
                                    <FormGroup>
                                        <Label
                                            htmlFor='arthash'
                                            className='ml-3'
                                        >
                                            Art Hash
                                        </Label>
                                        <Input
                                            type='text'
                                            id='arthash'
                                            name='arthash'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className='row pl-5 pr-5'>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label htmlFor='desc' className='ml-3'>
                                            Art URL
                                        </Label>
                                        <Input
                                            type='text'
                                            id='arturl'
                                            name='arturl'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-6'>
                                    <FormGroup>
                                        <Label
                                            htmlFor='percut'
                                            className='ml-3'
                                        >
                                            Percentage Cut
                                        </Label>
                                        <Input
                                            type='number'
                                            id='percut'
                                            name='percut'
                                            onChange={this.handleInputChange}
                                        />
                                    </FormGroup>
                                </div>
                            </div>
                            <br />
                            <div className='row pl-5'>
                                <div className='col-6'>
                                    <Button
                                        color='primary'
                                        onClick={this.creatingItems}
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>
                            <br />
                        </Form>
                    </ModalBody>
                </Modal>
                <br />
                <br />
                <div className='row'>{Menu}</div>
                <br />
                <br />
                <br />
                <br />
                <br />
            </div>
        );
    }
}

export default AllItemComponent;
