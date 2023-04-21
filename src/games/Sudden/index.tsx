import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { getRandomColor } from "../../util";

// unit => ms
const MIN_SHOW_TIME = 1000;
const MAX_SHOW_TIME = 5000;

const ONE_SECOND_INTERVAL = 60;

const formatScore = (ms: number) => {
  if (ms < 1000) {
    return ms + " ms";
  }

  return ms / 1000 + " s";
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "START_TEST":
      return { ...state, start: true, timing: false, score: 0 };
    case "START_TIMING":
      return { ...state, timing: true };
    case "END_TIMING":
      return { ...state, start: false, timing: false, score: action.score };
  }
};

export const Sudden = () => {
  const startTime = useRef(0);
  const [state, dispatch] = useReducer(reducer, {
    start: false,
    timing: false,
    score: 0,
  });

  const bgColor = useMemo(
    () => (state.timing ? getRandomColor() : "unset"),
    [state.timing]
  );

  useEffect(() => {
    if (state.timing) {
      startTime.current = new Date().getTime();
    }
  }, [state.timing]);

  useEffect(() => {
    let timer: any;

    if (state.start) {
      let number = 0;
      const minTotalIntervals = (MIN_SHOW_TIME / 1000) * ONE_SECOND_INTERVAL;
      const maxTotalIntervals = (MAX_SHOW_TIME / 1000) * ONE_SECOND_INTERVAL;
      const point = Math.floor(
        maxTotalIntervals +
          (minTotalIntervals + 1 - maxTotalIntervals) * Math.random()
      );

      timer = setInterval(() => {
        number++;

        if (number === point) {
          clearInterval(timer);

          dispatch({ type: "START_TIMING" });
        }
      }, 1000 / ONE_SECOND_INTERVAL);
    }

    return () => {
      timer = null;
    };
  }, [state.start]);

  return (
    <Flex pb={32} h="100%" align="center" justify="center" bg={bgColor}>
      {state.start ? (
        <Box
          w="100%"
          h="100%"
          onClick={() => {
            if (state.timing && !state.score) {
              dispatch({
                type: "END_TIMING",
                score: new Date().getTime() - startTime.current,
              });
            }
          }}
        />
      ) : (
        <Box textAlign="center">
          {state.score ? (
            <Box mb={8}>
              <Text fontSize={32} as="b">
                {formatScore(state.score)}
              </Text>
            </Box>
          ) : null}
          <Button
            colorScheme="teal"
            h="90px"
            w="90px"
            size="lg"
            rounded={10}
            onClick={() => dispatch({ type: "START_TEST" })}
          >
            {state.score ? "Retry" : "Start"}
          </Button>
        </Box>
      )}
    </Flex>
  );
};
