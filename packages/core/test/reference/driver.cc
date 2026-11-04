// Batch driver for Google's robots.txt matcher: reads a robots.txt file, then
// lines "agent<TAB>url" from stdin, prints "1" (allowed) or "0" per line.
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include "robots.h"
int main(int argc, char** argv) {
  std::ifstream f(argv[1], std::ios::binary);
  std::stringstream ss; ss << f.rdbuf();
  std::string body = ss.str();
  std::string line;
  while (std::getline(std::cin, line)) {
    auto tab = line.find('\t');
    std::string agent = line.substr(0, tab), url = line.substr(tab + 1);
    googlebot::RobotsMatcher m;
    std::cout << (m.OneAgentAllowedByRobots(body, agent, url) ? "1" : "0") << "\n";
  }
}
