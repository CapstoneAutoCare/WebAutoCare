import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonBase,
  Pagination,
  Tooltip,
  Box,
  Grid,
} from "@mui/material";
import usePagination from "../../Data/Pagination";
import PostApi from "../Axios/PostApi";

const makeStatus = (status) => {
  if (status === "ACCEPT") {
    return {
      background: "rgb(145 254 159 / 47%)",
      color: "green",
    };
  } else if (status === "INACTIVE") {
    return {
      background: "#ffadad8f",
      color: "red",
    };
  } else if (status === "REQUESTCOMPANY") {
    return {
      background: "#59bfff",
      color: "blue",
    };
  }
};
export default function Post(PostItems) {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await PostApi.getAllPost();
      setPosts(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  let [page, setPage] = useState(1);
  const PER_PAGE = 4;
  const count = Math.ceil(posts.length / PER_PAGE);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.periodDate) - new Date(a.periodDate)
  );

  const _Data = usePagination(sortedPosts, PER_PAGE);

  // Function to handle page change
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    _Data.jump(newPage);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  return (
    <Box
      // display="flex"
      alignItems="center"
      justifyContent="center"
      padding="16px"
      height="100%"
    >
      <h3>Lịch sử đặt sân</h3>

      <Grid>
        <TableContainer
          component={Paper}
          style={{
            boxShadow: "0px 13px 20px 0px #80808029",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên sân bóng</TableCell>
                <TableCell>Quận</TableCell>
                <TableCell>Loại sân</TableCell>
                <TableCell>Giờ bắt đầu</TableCell>
                <TableCell>Giờ kết thúc</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Giá</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (PostItems = _Data.currentData().map((post) => (
                  <TableRow key={`${post.postId}-${post.companyId}`}>
                    {/* <TableCell component="th" scope="row"> */}
                    <TableCell>{post.postId}</TableCell>
                    <TableCell>
                      <Tooltip title={post.description} enterDelay={300}>
                        {post.description.length >= 400
                          ? `${post.description.substring(0, 400)}...`
                          : post.description}
                      </Tooltip>
                    </TableCell>
                    <TableCell>{formatDate(post.periodDate)}</TableCell>
                    <TableCell>{formatDate(post.expiredDate)}</TableCell>

                    <TableCell>
                      <Tooltip
                        className="status"
                        style={makeStatus(post.statusPost)}
                      >
                        {post.statusPost.length >= 7
                          ? `${post.statusPost.substring(0, 7)}`
                          : post.statusPost}
                      </Tooltip>
                    </TableCell>
                    <TableCell>{post.location}</TableCell>
                    <TableCell>{post.salary}$</TableCell>
                    <TableCell className="Details">
                      <ButtonBase>SHOW</ButtonBase>
                    </TableCell>
                  </TableRow>
                )))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Pagination
        variant="outlined"
        color="primary"
        showFirstButton
        showLastButton
        count={count}
        size="large"
        page={page}
        onChange={handlePageChange}
      />
    </Box>
  );
}
