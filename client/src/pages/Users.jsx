import React, { useState, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import "./Users.css";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import CreateGroup from "../components/CreateGroup";
import { useAuthContext } from "../hooks/useAuthComtext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const {
    user,
    notification,
    setNotification,
    selectedGroup,
    setSelectedGroup,
    setShowChat,
    socket,
    setSocket,
    IsGroupAdmin,
    setIsGroupAdmin,groupSenders
  } = useAuthContext();
  useEffect(() => {
    // Load followed users from localStorage on component mount
    const storedFollowedUsers = JSON.parse(
      localStorage.getItem("followedUsers")
    );
    if (storedFollowedUsers) {
      setFollowedUsers(storedFollowedUsers);
    }
debugger
    // Fetch users from the server
    axios
      .get("http://localhost:3001/api/v1/getAllUsers")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  // const handleFollow = (userId) => {
  //   // // Check if user is followed
  //   // const isFollowed = followedUsers.includes(userId);

  //   // if (isFollowed) {
  //   //   // If user is followed, unfollow
  //   //   const updatedFollowedUsers = followedUsers.filter((id) => id !== userId);
  //   //   setFollowedUsers(updatedFollowedUsers);
  //   //   localStorage.setItem("followedUsers", JSON.stringify(updatedFollowedUsers));
  //   // } else {
  //   //   // If user is not followed, follow
  //   //   const updatedFollowedUsers = [...followedUsers, userId];
  //   //   setFollowedUsers(updatedFollowedUsers);
  //   //   localStorage.setItem("followedUsers", JSON.stringify(updatedFollowedUsers));
  //   // }
  //   // const response = await axios.post(
  //   //     "http://localhost:3001/api/v1/createGroup",
  //   //     { username ,user}
  //   //   );
  // };
  const handleFollow = async () => {
    try {
      // Send a request to the server to get the ID of the user being followed
      //const response = await axios.get("http://localhost:3001/api/v1/getUserId");
      const userId = users._id;
  
      // Now you have the ID of the user being followed
      // You can use the same logic as in the Users component to follow the user
      // For example:
      const isFollowed = followedUsers.includes(userId);
      if (!isFollowed) {
        const response = await axios.post(
          "http://localhost:3001/api/v1/followUser",
          { userId }
        );
        const newFollowedUsers = [...followedUsers, userId];
        setFollowedUsers(newFollowedUsers); // Update followed users list
        localStorage.setItem("followedUsers", JSON.stringify(newFollowedUsers));
        //setShowChat(true); // Open chat
      } else {
        // User is already followed, handle accordingly
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      // Handle error
    }
  };
  
  
  
  const columns = React.useMemo(
    () => [
      {
        Header: "Users",
        accessor: "username",
      },
      {
        Header: "Follow/Unfollow",
        accessor: "_id",
        Cell: ({ row }) => (
          <button
            className={
              followedUsers.includes(row.original._id)
                ? "unfollow-button"
                : "follow-button"
            }
            onClick={() => handleFollow(row.original._id)}
          >
            {followedUsers.includes(row.original._id) ? "Unfollow" : "Follow"}
          </button>
        ),
      },
    ],
    [followedUsers]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: users,
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <div className="searchInputDiv">
      <button onClick={onOpen}>
        <SearchIcon className="searchIcon" boxSize={6} ref={btnRef}>
          Open
        </SearchIcon>
        Search user
      </button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <input
              type="text"
              className="searchInputUsers"
              placeholder="Search Users..."
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
            <table {...getTableProps()} className="userTable">
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()} className="">
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()} className="userTh">
                        {column.render("Header")}{" "}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td className="userId" {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Users;
