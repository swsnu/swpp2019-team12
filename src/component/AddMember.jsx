// import React, { Component } from 'react';
// import SearchInput, { createFilter } from 'react-search-input';

// const KEYS_TO_FILTERS = ['user.email'];

// class AddMember extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             searchKeyword: ''
//         };
//         this.searchUpdated = this.searchUpdated.bind(this);
//     }

//     searchUpdated(term) {
//         this.setState({ searchKeyword: term });
//     }

//     render() {
//         const filteredEmails = emails.filter(
//             createFilter(this.state.searchKeyword, KEYS_TO_FILTERS)
//         );
//         return (
//             <div>
//                 <div>Add Members</div>
//                 <SearchInput
//                     className="search-input"
//                     onChange={this.searchUpdated}
//                 />
//                 {filteredEmails.map(email => {
//                     return (
//                         <div className="mail" key={email.id}>
//                             {email.user.name}
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     }
// }

// export default AddMember;
