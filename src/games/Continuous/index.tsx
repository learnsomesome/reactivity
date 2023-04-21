import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useReducer } from "react";
import { IconBox } from "./IconBox";

const MAX_ITEM = 20;

export const ICONS_MAP = [
  {
    no: "1",
    colorScheme: "teal",
    icon: <CheckIcon />,
  },
  {
    no: "2",
    colorScheme: "red",
    icon: <CloseIcon />,
  },
  {
    no: "3",
    colorScheme: "red",
    icon: <CheckIcon />,
  },
  {
    no: "4",
    colorScheme: "teal",
    icon: <CloseIcon />,
  },
];

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "START_TEST":
      return { ...state, start: true, score: 0, noList: [] };
    case "CHOOSED_ICON":
      return { ...state, rightNo: action.rightNo };
    case "START_GAMING":
      return { ...state, noList: action.noList };
    case "STATISTICAL_SCORE":
      return { ...state, score: action.score };
    case "UPDATE_PROGRESS":
      return { ...state, progress: action.progress };
    case "END_TEST":
      return { ...state, start: false, progress: 0 };
  }
};

export const Continuous = () => {
  const [state, dispatch] = useReducer(reducer, {
    start: false,
    rightNo: "1",
    noList: [],
    score: 0,
    progress: 0,
  });

  const choosing = state.start && state.noList.length === 0;
  const gaming = state.start && state.noList.length > 0;
  const settling = !state.start && state.noList.length > 0;

  const fullScore = state.noList.filter(
    (no: string) => no === state.rightNo
  ).length;

  const prePareGame = () => {
    let noList: string[] = [];

    while (!noList.includes(state.rightNo)) {
      noList = new Array(MAX_ITEM)
        .fill("")
        .map(() => Math.ceil(Math.random() * 4).toString());
    }

    dispatch({ type: "START_GAMING", noList });
  };

  return (
    <>
      <Flex
        className="game-area"
        position="relative"
        pb={32}
        h="100%"
        align="center"
        justify="center"
      >
        {gaming ? (
          <Box w="100%" h="100%">
            <Progress
              hasStripe
              isAnimated
              mb={6}
              max={MAX_ITEM - 1}
              value={state.progress}
            />
            {state.noList.map((no: string, index: number) => (
              <IconBox
                key={index}
                no={no}
                rightNo={state.rightNo}
                score={state.score}
                index={index}
                onIconClick={(score: number) =>
                  dispatch({ type: "STATISTICAL_SCORE", score })
                }
                onProgress={(progress: number) =>
                  dispatch({ type: "UPDATE_PROGRESS", progress })
                }
                onTestEnded={() => {
                  if (index === state.noList.length - 1) {
                    dispatch({ type: "END_TEST" });
                  }
                }}
              />
            ))}
          </Box>
        ) : (
          <Box textAlign="center">
            {settling ? (
              <Stack direction="column" spacing="8" mb={8}>
                <Text fontSize={48}>
                  {fullScore === state.score ? "😀" : "😭"}
                </Text>
                <Text fontSize={32} as="b">
                  Full Score: {fullScore}
                </Text>
                <Text fontSize={32} as="b">
                  Your Score: {state.score}
                </Text>
              </Stack>
            ) : null}
            <Button
              colorScheme="teal"
              h="90px"
              w="90px"
              size="lg"
              rounded={10}
              onClick={() => dispatch({ type: "START_TEST" })}
            >
              {settling ? "Retry" : "Start"}
            </Button>
          </Box>
        )}
      </Flex>
      <Modal
        isCentered
        isOpen={choosing}
        onClose={() => dispatch({ type: "END_TEST" })}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Choose the icon you think is correct</ModalHeader>
          <ModalBody>
            <Stack direction="row" spacing="12">
              {ICONS_MAP.map(({ no, colorScheme, icon }) => (
                <IconButton
                  key={no}
                  w="48px"
                  h="48px"
                  outline={state.rightNo === no ? "6px solid skyblue" : "unset"}
                  colorScheme={colorScheme}
                  aria-label="Choosed icon"
                  icon={icon}
                  onClick={() =>
                    dispatch({ type: "CHOOSED_ICON", rightNo: no })
                  }
                />
              ))}
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={prePareGame}>
              Confirm
            </Button>
            <Button onClick={() => dispatch({ type: "END_TEST" })}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
