import React, { Component } from 'react';

const Barcoder = (props) => {
	const markup = (
		<div className="barcoder">
			<div className="title">Sale Stock {props.index}</div>
			<img src="http://www.ascd.org/ASCD/images/siteASCD/misc/sample-qr-code.png" width='35%' />
			<div className="sku">{props.sku}</div>
			<div className="description">{props.description}</div>
			<div className="footer">
				<div className="date">8/16/2016</div>
				<div className="pass">PASS</div>
			</div>
		</div>
	);
	
	return markup;
};

const ContainerBarcode = (props) => {
	return <div className="page"><div className="container-barcode">{props.children}</div></div>;
};

class Preview extends Component {
	constructor(props){
		super(props);
		this.state = {
			count: 4,
			submit: false
		}
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidUpdate() {
		if (this.state.submit) {
			window.print();
			this.setState({submit: false});
		}
	}

	onSubmit(e) {
		const totalPrint = this.refs.totBarcode.value;
		this.setState({
			count: parseInt(totalPrint),
			submit: true
		});
	}

	render () {
		let pages = [], barcode = [];
		for(let i=1; i<=this.state.count; i++){
			if (i%4 != 0 || i === 1) {
				barcode.push(<Barcoder key={"barcode" + i} index={i} sku="DEK-B1B0-0052RED-RLL" description="Efigha Batik Flare Blouse (Black)" />);
				if (i == this.state.count) {
					pages.push(<ContainerBarcode key={"container" + i}>{barcode}</ContainerBarcode>);
				}
			}
			else {
				barcode.push(<Barcoder key={"barcode" + i} index={i} sku="DEK-B1B0-0052RED-RLL" description="Efigha Batik Flare Blouse (Black)" />);
				pages.push(<ContainerBarcode key={"container" + i}>{barcode}</ContainerBarcode>);
				barcode = [];
			}
		}
		return(
			<div>
				<div className="form-group">
					<label className="sr-only">Total Barcode</label>
					<input type="text" className="form-control" placeholder="Total Barcode" ref="totBarcode" />
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-default" style={{width: '100%'}} onClick={this.onSubmit}>Submit</button>
				</div>
				<div className="section-to-print">
					{pages.map((page, i) => {
						return page;
					})}
				</div>
			</div>
		);
	}
};

export default Preview;